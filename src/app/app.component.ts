import { Component } from '@angular/core';

import { default_store } from './constants/default_store';
import { LocalStorageInteractionService } from "./services/local-storage-interaction.service";
import { Grid } from './interfaces/grid';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import SimpleCrypto from "simple-crypto-js"
import { Card } from './interfaces/card';


const secretKey = "some-unique-key";
const simpleCrypto = new SimpleCrypto(secretKey);

function toTitleCase(str:string) {
  return str.toLowerCase().replace(/\.\s*([a-z])|^[a-z]/gm, s => s.toUpperCase());
}


@Component({
  selector: "app-root",
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = "app";
  store:Grid = [];
  showModal = false;
  titleError = "";
  descriptionError = "";
  disableBtn = false
  
  active_modal = {
    i : -1,
    j : -1
  }

  fetchStore = () => {

    try {
      
      let local = LocalStorageInteractionService.fetchData("store");
      if(local === "" || local === null) return default_store;
      
      return JSON.parse(JSON.stringify(simpleCrypto.decrypt(local)));

    } catch (error) {
      return default_store
    }
  }

  clearData = () => {

    LocalStorageInteractionService.clearData();
    this.store = this.fetchStore();
    console.log(this.store);

    this.saveDataToLocal();

  }

  saveDataToLocal = () => {

    const data = simpleCrypto.encrypt(JSON.stringify(this.store));
    // console.log(this.store, data);
    LocalStorageInteractionService.saveData("store", data);
  }

  printData = () => {
    console.log(this.store);
  }

  handleTitleChange = (event:any) => {
    this.titleError = "";
    this.disableBtn = false;

    let val = event.target.value;

    const returnError = (error:string) => {
      this.titleError = error 
      this.disableBtn = true;
    }

    if(val.length == 0){
      returnError("Title cannot be blank.");
      return;
    }
    if (!/^[A-Za-z ]+$/.test(val)){
      returnError("Title cannot contain characters other than alphabets and spaces.");
      return;
    }

    val = toTitleCase(val);
    this.store[this.active_modal.i].children[this.active_modal.j].title = val;
    this.saveDataToLocal();
  }

  handleDescriptionChange = (event:any) => {

    this.descriptionError = "";
    this.disableBtn = false;

    let val = event.target.value;

    const returnError = (error:string) => {
      this.descriptionError = error 
      this.disableBtn = true;
    }

    if(val.length < 25){
      returnError("Description should be of a minimum 25 characters.");
      return;
    }

    this.store[this.active_modal.i].children[this.active_modal.j].description = event.target.value;
    this.saveDataToLocal();
  }

  handleColumnKeyChange = (index:number, event:any) => {
    
    this.store[index].key = event.target.value;
    this.saveDataToLocal();
  }

  getCategories = () => {
    let arr = [];
    for (const index in this.store) {
      if (Object.prototype.hasOwnProperty.call(this.store, index)) {
        const column = this.store[index];

        arr.push({
          ...column,
          index
        });
        
      }
    }
    return arr;
  }

  handleCategoryChange = (prevCol:number, prevRow:number, event:any, modal:any) => {

    const newCol = event.target.value;

    const card:Card = this.store[prevCol].children[prevRow];

    this.store[prevCol].children.splice(prevRow, 1);

    this.store[newCol].children.push(card);
    this.saveDataToLocal();

    modal.dismiss("done");

    this.active_modal = {
      i : newCol,
      j : this.store[newCol].children.length - 1
    }

  }

  addCategory = () => {
    this.store.push({
      key : "New Category",
      children : []
    })

    this.saveDataToLocal();
  }

  deleteCategory = (index:number) => {
    this.store.splice(index, 1);
    this.saveDataToLocal();
  }

  addCard = (i:number) => {
    this.store[i].children.push({
      title : "Title",
      description : "Description"
    })

    this.active_modal = {
      i,
      j : this.store[i].children.length - 1
    }

    this.saveDataToLocal();
  }

  deleteCard = (i:number, j:number, modal:any) => {
    modal.dismiss("deleted card");
    this.active_modal = {
      i : -1,
      j : -1
    }
    this.store[i].children.splice(j, 1);
    this.saveDataToLocal();
  }

  show = (a:number, b:number) => {
    
    this.active_modal.i = a;
    this.active_modal.j = b;
  }

  hide = () => {

    this.active_modal = {
      i : -1,
      j : -1
    }
  }

  subs = new Subscription();
  

  constructor(private dragulaService: DragulaService){

    this.store = this.fetchStore();
    this.saveDataToLocal();

    this.subs.add(this.dragulaService.drop()
      .subscribe(() => {
        this.saveDataToLocal();
      })
    );
  }

  ngOnDestroy() {
    // destroy all the subscriptions at once
    this.subs.unsubscribe();
  }
}
