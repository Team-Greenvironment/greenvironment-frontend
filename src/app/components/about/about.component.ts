import { Component, OnInit, ViewChild } from '@angular/core';
import { Activitylist } from 'src/app/models/activity';
import { Levellist } from 'src/app/models/levellist';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ActivityService } from 'src/app/services/activity/activity.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {
  actionlist: Activitylist = new Activitylist();
  levellist: Levellist = new Levellist();

  displayedColumns = ['points', 'name', 'description'];
  dataSource = new MatTableDataSource(this.actionlist.Actions);
  displayedLevelColumns = ['level', 'name'];
  levelSource = this.levellist.levels;

  constructor(private activityService: ActivityService) { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    this.activityService.getActivities();
    this.activityService.activitylist.subscribe(response => {
      this.actionlist = response;
      this.dataSource = new MatTableDataSource(this.actionlist.Actions);
      this.dataSource.sort = this.sort;
    });
  }

}
