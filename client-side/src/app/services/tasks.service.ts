import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PepAddonService, PepHttpService } from '@pepperi-addons/ngx-lib';
import { config } from '../app.config'
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private pepHttpService: PepHttpService,
    private pepAddonService: PepAddonService
  ) { }

  tasksEndpointURL: string = `/addons/api/${config.AddonUUID}/api/my_tasks`

  async getTasks(options: { search: string; }) {
    let where = ''

    if (options.search) {
      where = encodeURI(`Title LIKE '%${options.search}%'`)
    }

    return this.pepHttpService.getPapiApiCall(`${this.tasksEndpointURL}?where=${where}`).toPromise();
  }

  async deleteTasks(tasks: string[]) {
      for (const task of tasks) {
        console.log("Deleting task: ", task);
        return this.pepHttpService.postPapiApiCall(this.tasksEndpointURL, {
          Key: task,
          Hidden: true,
          Title: 'Deleting this'
        }).toPromise()
      }
  }
}
