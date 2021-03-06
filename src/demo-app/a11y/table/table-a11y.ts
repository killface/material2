import {Component, ViewChild} from '@angular/core';
import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MatSort, MatPaginator} from '@angular/material';

export interface UserData {
  name: string;
  color: string;
  age: number;
}

const exampleData = [
  {name: 'Austin', color: 'blue', age: 30},
  {name: 'Jeremy', color: 'green', age: 33},
  {name: 'Kara', color: 'purple', age: 29},
  {name: 'Tina', color: 'yellow', age: 35},
  {name: 'Brad', color: 'pink', age: 40},
  {name: 'Jules', color: 'red', age: 21},
];

@Component({
  moduleId: module.id,
  selector: 'table-a11y',
  templateUrl: 'table-a11y.html',
  styleUrls: ['table-a11y.css'],
})
export class TableAccessibilityDemo {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) pager: MatPaginator;

  displayedColumns = ['name', 'color', 'age'];
  basicDataSource: BasicDataSource;
  sortDataSource: SortDataSource;
  paginatedDataSource: PaginatedDataSource;

  ngOnInit(): void {
    this.basicDataSource = new BasicDataSource();
    this.sortDataSource = new SortDataSource(this.sort);
    this.paginatedDataSource = new PaginatedDataSource(this.pager);
  }
}

export class BasicDataSource extends DataSource<UserData> {
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);

  constructor() {
    super();
    this.dataChange.next(exampleData);
  }

  connect(): Observable<UserData[]> {
    return this.dataChange;
  }

  disconnect() {}
}

export class SortDataSource extends DataSource<UserData> {
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);

  constructor(private _sort: MatSort) {
    super();
    this.dataChange.next(exampleData);
  }

  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {}

  getSortedData(): UserData[] {
    const data = [...exampleData];
    if (!this._sort.active || this._sort.direction == '') {
      return data;
    }

    return data.sort((a: UserData, b: UserData) => {
      return (a.age < b.age ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}

export class PaginatedDataSource extends DataSource<UserData> {
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);

  constructor(private _paginator: MatPaginator) {
    super();
    this.dataChange.next(exampleData);
  }

  connect(): Observable<UserData[]> {
    const displayDataChanges = [
      this.dataChange,
      this._paginator.page,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      const data = [...exampleData];
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() {}
}
