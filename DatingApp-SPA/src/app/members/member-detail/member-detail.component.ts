import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_thirdpartyservices/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Image } from '@ks89/angular-modal-gallery';
// import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: User;

  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  images = [];
  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data.user;
    });

    // this.galleryOptions = [
    //   {
    //     width: '500px',
    //     height: '500px',
    //     imagePercent: 100,
    //     thumbnailsColumns: 4,
    //     imageAnimation: NgxGalleryAnimation.Slide
    //   }
    // ];

    // this.galleryImages = this.getImages();
    this.images = this.getImages();
  }

  // members/ id
  // loadUser() {
  //   this.userService.getUser(+this.route.snapshot.params.id).subscribe((user: User) => {
  //     this.user = user;
  //   }, error => {
  //     this.alertify.error(error);
  //   });
  // }

  getImages() {
    const images = [];
    if (this.user.photos.length != 0) {
      for (const photo of this.user.photos) {
        images.push(
          new Image(photo.id, {
            img: photo.url,
            extUrl: 'http://www.google.com'
          })
        );
      }
    }
    else {
      images.push(
        new Image(0, {
          img: '../../../assets/user.png',
          extUrl: 'http://www.google.com'
        })
      );
    }
    return images;
  }
}
