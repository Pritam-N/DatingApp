import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { Message } from 'src/app/_models/Message';
import { AlertifyService } from 'src/app/_thirdpartyservices/alertify.service';
import { tap } from 'rxjs/operators';
import { MlService } from 'src/app/_services/ml.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number;

  messages: Message[];
  newMessage: any = {};
  messagePlaceHolder: string = 'Enter some text';
  responseText: string = '';
  stopWords: string = '.?!';
  oldText: string = '';
  newText: string = '';

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

  getPredictions($event) {
    if ($event.keyCode == 39) {
      this.newMessage.content += this.responseText;
      this.oldText = this.newMessage.content;
      this.responseText = '';
      this.messagePlaceHolder = '';
    }
    else if ($event.keyCode == 32 || $event.keyCode == 8) {
      this.messagePlaceHolder = '';
      return;
    }
    else {
      const message = this.newMessage.content.trim();

      this.newText = message.substring(this.oldText.length);

      this.messagePlaceHolder = '';
      if (message.trim() != '') {
        this.mlService.getSuggestion(this.oldText, this.newText).subscribe((response) => {
          this.responseText = response.toString();
          if (this.responseText.includes(this.newText)) {
            this.responseText = this.responseText.substring(this.newText.length + 1, this.responseText.length);
          }
          this.changePrediction($event);
        }, error => {
          this.alertify.error(error);
        });
      }
    }
  }

  changePrediction($event) {
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
    this.messagePlaceHolder = placeText + this.responseText;
  }
}
