import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';

import { PepLayoutService, PepScreenSizeType } from '@pepperi-addons/ngx-lib';
import { PepSelectionData } from '@pepperi-addons/ngx-lib/list';

import { IPepGenericListDataSource, IPepGenericListActions, IPepGenericListParams } from "@pepperi-addons/ngx-composite-lib/generic-list";
import { TasksService } from "src/app/services/tasks.service";

@Component({
    selector: 'editor-list',
    templateUrl: './editor-list.component.html',
    styleUrls: ['./editor-list.component.scss']
})
export class EditorListComponent implements OnInit {
    screenSize: PepScreenSizeType;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public layoutService: PepLayoutService,
        public translate: TranslateService,
        private taskService: TasksService
    ) {
        this.layoutService.onResize$.subscribe(size => {
            this.screenSize = size;
        });
    }

    ngOnInit() {
    }

    openDialog() {
        
    }

    getDataSource(): IPepGenericListDataSource {
        return {
            init: async (state) => {
                const items = await this.getTasks(state);
                return {
                    dataView: {
                        Context: {
                            Name: '',
                            Profile: { InternalID: 0 },
                            ScreenSize: 'Landscape'
                          },
                          Type: 'Grid',
                          Title: '',
                          Fields: [
                            {
                                FieldID: 'Title',
                                Type: 'TextBox',
                                Title: 'Title',
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'Description',
                                Type: 'TextBox',
                                Title: 'Desc',
                                Mandatory: false,
                                ReadOnly: true
                            },
                            {
                                FieldID: 'StartDateTime',
                                Type: 'DateAndTime',
                                Title: 'Starts',
                                Mandatory: false,
                                ReadOnly: true
                            }
                          ],
                          Columns: [
                            {
                              Width: 25
                            },
                            {
                              Width: 50
                            },
                            {
                              Width: 25
                            }
                          ],
                          FrozenColumnsCount: 0,
                          MinimumColumnWidth: 0
                    }, 
                    items: items, 
                    totalCount: items.length       
                }
            }
            
        }
    }
    
    listDataSource: IPepGenericListDataSource = this.getDataSource()

    actions: IPepGenericListActions = {
        get: async (data: PepSelectionData) => {
            const editAction = {
                title: this.translate.instant("Edit"),
                handler: async (data) => {
                    this.router.navigate([[data?.rows[0]].toString()], {
                        relativeTo: this.route,
                        queryParamsHandling: 'merge'
                    });
                }
            };

            const deleteAction = {
                title: this.translate.instant("Delete"),
                handler: async (data) => {
                    await this.deleteTasks(data.rows)
                    this.listDataSource = this.getDataSource()
                }
            };

            const actions = [];

            if (data.rows.length > 0) {

                if (data.rows.length === 1) {
                    actions.push(editAction);
                }

                actions.push(deleteAction);
            }

            return actions;
        }
    }

    async getTasks(state: IPepGenericListParams) {
        return this.taskService.getTasks({
            search: state.searchString
        })
    }

    async deleteTasks(tasks: string[]) {
        await this.taskService.deleteTasks(tasks)   
    }
}
