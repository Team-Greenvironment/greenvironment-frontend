import {Component, OnInit, ViewChild} from '@angular/core';
import {Activitylist} from 'src/app/models/activity';
import {LevelList} from 'src/app/models/levellist';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ActivityService} from 'src/app/services/activity/activity.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {
  actionlist: Activitylist = new Activitylist();
  levellist: LevelList = new LevelList();

  displayedColumns = ['points', 'name', 'description'];
  dataSource = new MatTableDataSource(this.actionlist.Actions);
  displayedLevelColumns = ['level', 'name'];
  levelSource = new MatTableDataSource(this.levellist.levels);

  constructor(private activityService: ActivityService) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() {
    this.activityService.getActivities();
    this.activityService.activitylist.subscribe(response => {
      this.actionlist = response;
      this.dataSource = new MatTableDataSource(this.actionlist.Actions);
      this.dataSource.sort = this.sort;
    });
    this.activityService.getLevels();
    this.activityService.levelList.subscribe(response => {
      this.levellist = response;
      this.levelSource = new MatTableDataSource(this.levellist.levels);
      this.levelSource.sort = this.sort;
    });
  }

}
