import { Component, OnInit, ViewChild } from '@angular/core';
import { Activitylist } from 'src/app/models/activity';
import { Levellist } from 'src/app/models/levellist';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.sass']
})
export class AboutComponent implements OnInit {
  actionlist: Activitylist = new Activitylist();
  levellist: Levellist = new Levellist();

  displayedColumns = ['points', 'name'];
  dataSource = new MatTableDataSource(this.actionlist.Actions);
  displayedLevelColumns = ['level', 'name'];
  levelSource = this.levellist.levels;

  constructor() { }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

}
