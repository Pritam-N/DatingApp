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

  getPredictions() {
    this.placeTextArea.nativeElement.placeholder = ''
    if (this.contentTextArea.nativeElement.value.trim() == '') {
      this.placeTextArea.nativeElement.placeholder = 'Send private message here...';
    }

    const message = this.newMessage.content;
    this.mlService.getSuggestion(message).subscribe((response) => {
      // console.log(response);
      this.changePrediction(response);
    }, error => {
      this.alertify.error(error);
    });
  }

  changePrediction(response) {
    var inputText = this.contentTextArea.nativeElement.value;
    var placeText = '';
    for (let i = 0; i <= inputText.length + 5; i++) {
      if (inputText[i] == '\n') {
        placeText += '\n'
      }
      else {
        placeText += ' ';
      }
    }
    var responseText = response.substring(placeText.length - 5, response.length);
    this.placeTextArea.nativeElement.placeholder = placeText + responseText;

    const messageBox = document.querySelector("[name=content]");
    messageBox.addEventListener("keydown", (e: KeyboardEvent) => {
      let { keyCode } = e;
      if (keyCode == 9) {
        e.preventDefault();
        console.log(responseText)
        this.contentTextArea.nativeElement.value += responseText;
      }
    })
  }
}
