import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
import { Message } from 'src/app/_models/Message';
import { AlertifyService } from 'src/app/_thirdpartyservices/alertify.service';
import { tap } from 'rxjs/operators';
import { MlService } from 'src/app/_services/ml.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit, AfterViewInit {

  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};

  constructor(private authService: AuthService, private userService: UserService,
    private alertify: AlertifyService, private mlService: MlService) {

  }


  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodedToken.nameid;
    this.userService.getMessageThread(this.authService.decodedToken.nameid, this.recipientId)
      .pipe(
        tap(messages => {
          for (const message of messages) {
            if (message.isRead === false && message.recipientId === currentUserId) {
              this.userService.markAsread(currentUserId, message.id);
            }
          }
        })
      )
      .subscribe(
        messages => {
          this.messages = messages;
        }, error => {
          this.alertify.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodedToken.nameid, this.newMessage)
      .subscribe((message: Message) => {
        this.messages.push(message);
        this.newMessage.content = '';
      }, error => {
        this.alertify.error(error);
      });
  }

  @ViewChild('placeTextArea') placeTextArea: ElementRef;
  @ViewChild('contentTextArea') contentTextArea: ElementRef;
  ngAfterViewInit(): void {

  }

  getPredictions($event) {
    const message = this.newMessage.content;
    if (message.trim() != '') {
      this.mlService.getSuggestion(message).subscribe((response) => {
        var responseText = response.toString();
        if (responseText.includes(message)) {
          responseText = responseText.substring(message.length + 1, responseText.length);
        }
        this.changePrediction($event, responseText);
      }, error => {
        this.alertify.error(error);
      });
    }
  }

  changePrediction($event, responseText) {
    const message = this.newMessage.content;
    var placeText = '';
    for (let i = 0; i <= message.length; i++) {
      if (message[i] == '\n') {
        placeText += '\n '
      }
      else {
        placeText += " ";
      }
    }
    placeText += "   ";
    this.placeTextArea.nativeElement.placeholder = placeText + responseText;
    if ($event.keyCode == 39) {
      this.newMessage.content += responseText;
      this.placeTextArea.nativeElement.placeholder = '';
    }
  }
}
