import {environment} from 'src/environments/environment';

export class GroupInfo {
  id: number;
  name: string;
  picture: string;
  allowedToJoinGroup = false;

  constructor(pId: number, pName: string, picture: string) {
    this.id = pId;
    this.name = pName;
    this.picture = this.buildPictureUrl(picture);
  }

  buildPictureUrl(path: string): string {
    if (path) {
      return environment.greenvironmentUrl + path;
    } else {
      return 'assets/images/default-grouppic.svg';
    }
  }

}
