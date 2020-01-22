import {environment} from 'src/environments/environment';

export class GroupInfo {
  id: number;
  name: string;
  picture: string;
  deletable: boolean;
  allowedToJoinGroup = false;

  constructor(pId: number, pName: string, picture: string, deletable: boolean) {
    this.id = pId;
    this.name = pName;
    this.picture = this.buildPictureUrl(picture);
    this.deletable = deletable;
  }

  buildPictureUrl(path: string): string {
    if (path) {
      return environment.greenvironmentUrl + path;
    } else {
      return 'assets/images/default-grouppic.svg';
    }
  }

}
