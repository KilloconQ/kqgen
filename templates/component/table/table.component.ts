import {
  Component,
  input,
  effect,
  signal,
  computed,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule
} from '@angular/material/paginator';
import {
  MatSort,
  MatSortModule
} from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTableModule
} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

interface TableColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-{{name}}',
  templateUrl: './{{name}}.component.html',
  styleUrls: ['./{{name}}.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    FormsModule
  ],
})
export class {{pascalName}}Component implements AfterViewInit {
  columns = input<TableColumn[]>();
  data = input<any[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filterValue = signal('');

  readonly tableData = signal(new MatTableDataSource([]));
  readonly displayedColumns = computed(() => this.columns().map(c => c.key));

  constructor() {
    effect(() => {
      const ds = new MatTableDataSource(this.data());
      ds.filterPredicate = (data: any, filter: string) =>
        Object.values(data).some(v =>
          String(v).toLowerCase().includes(filter.trim().toLowerCase())
        );
      this.tableData.set(ds);
      queueMicrotask(() => {
        ds.paginator = this.paginator;
        ds.sort = this.sort;
        ds.filter = this.filterValue();
      });
    });

    effect(() => {
      this.tableData().filter = this.filterValue();
    });
  }

  ngAfterViewInit() {
    this.tableData().paginator = this.paginator;
    this.tableData().sort = this.sort;
  }
}
