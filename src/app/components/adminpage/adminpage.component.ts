import {Component, OnInit, ViewChild} from '@angular/core';
import {Levellist} from '../../models/levellist';
import {ActivityService} from '../../services/activity/activity.service';
import {Activitylist} from '../../models/activity';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.sass']
})
export class AdminpageComponent implements OnInit {

  public activitySource: MatTableDataSource<any>;
  public displayedActivityColumns = ['points', 'name', 'description'];

  @ViewChild(MatSort, {static: true}) activitySort: MatSort;

  constructor(private activityService: ActivityService) {
  }

  ngOnInit() {
    this.activityService.getActivities();
    this.activityService.activitylist.subscribe(response => {
      this.activitySource = new MatTableDataSource(response.Actions);
      this.activitySource.sort = this.activitySort;
    });
  }

}
