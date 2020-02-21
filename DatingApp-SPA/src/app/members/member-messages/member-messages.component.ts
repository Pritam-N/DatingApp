import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { User } from 'src/app/_models/user';
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

  constructor(private authService: AuthService, private userService: UserService,
 private alertify: AlertifyService, private mlService: MlService) { }

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

  getPredictions() {
    const message = this.newMessage.content;
    console.log(message);
    this.mlService.getSuggestion(message).subscribe((response) => {
      console.log(response);
    }, error => {
      this.alertify.error(error);
    });
  }
}
