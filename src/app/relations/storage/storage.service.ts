import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { serverURL } from '../../app.config';
import { Observable, Subscription } from 'rxjs';

export const CACHE_RELATIONS: string = "djmc-relations";
export const CACHE_COMPTEUR: string = "djmc-compteur";
export const LIMIT_CACHE: number = 5000;

const httpOptions = {
  headers: new HttpHeaders ({
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Allow-Headers": "Content-type",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  })
}
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private http: HttpClient
    ) 
  {}

  load(terme: string) {
  	let relationsStorage = this.getRelations();
    if (relationsStorage != null) {
      let termeRelationsStorage = relationsStorage.filter(function(element) { return element.t == terme; });
      if (termeRelationsStorage.length > 0) {
        if (this.checkDates(termeRelationsStorage[0]) != null) {
          this.setRelations(relationsStorage);
        }
        return termeRelationsStorage[0];
      }
    }
    return null;
  }

  saveLocal(terme: string, typeRelation: number, relations: Array<string>) {
  	if (relations.length <= LIMIT_CACHE) {
      let relationsStorage = this.getRelations();
      let compteur = this.getCompteur();
      let dateNow = Date.now();

      // Cache vide
      if (compteur == 0) {
        relationsStorage = [];
        relationsStorage.push(this.createRelations(terme, relations, typeRelation, dateNow));
      }
      // Cache non vide
      else {
        if ((compteur + relations.length) > LIMIT_CACHE) {
          relationsStorage = this.freeSpace(relationsStorage, relations.length);
        }
        let termeRelations = this.getTermeRelations(terme, relationsStorage)
        // Le terme n'a pas de relations en cache
        if (termeRelations == null) {
          relationsStorage.push(this.createRelations(terme, relations, typeRelation, dateNow));
        }
        // Le terme a des relations en cache
        else {
          termeRelations[typeRelation] = relations;
          if (termeRelations["d"] == null) {
            termeRelations["d"] = {}
          }
          termeRelations["d"]["t"] = dateNow;
          termeRelations["d"][typeRelation] = dateNow;
        }
      }	
      this.setRelations(relationsStorage);
      this.incrCompteur(relations.length);
    }
  }

  saveServer(terme: string, typeRelation: number, relations: Array<string>): Observable<any> {
    return this.http.post(serverURL+'/save', {'terme': terme, 'typeRelation': typeRelation, 'relations': relations});
  }

  cleanLocal() {
  	localStorage.removeItem(CACHE_RELATIONS);
    localStorage.removeItem(CACHE_COMPTEUR);
  }

  private freeSpace(relations, n: number) {
    let space = LIMIT_CACHE - this.getCompteur();
    let relationsSorted = relations.sort((a,b) => { return a["d"]["t"] - b["d"]["t"]});
    while (space < n) {
      let relationSize = this.getRelationsSize(relationsSorted[0]);
      this.decrCompteur(relationSize);
      relationsSorted = relationsSorted.slice(1);
      space += relationSize;
    }
    return relationsSorted;
  }

  private getRelationsSize(relations) {
    let result = 0;
    for (let key in relations) {
      if (!isNaN(Number(key))) {
        result += relations[key].length;
      }
    }
    return result;
  }

  private createRelations(terme, relations, typeRelation, date) {
    let terme_relations = {"t" : terme, "d" : {"t": date} }
    terme_relations[typeRelation] = relations;
    terme_relations["d"][typeRelation] = date;
    return terme_relations;
  }

  private getTermeRelations(terme, relations) {
    let termeRelations = relations.filter(function(element) { return element.t == terme; });
    if (termeRelations.length > 0) {
      return termeRelations[0];
    }
    return null;
  }

  getRelations() {
    return JSON.parse(localStorage.getItem(CACHE_RELATIONS));
  }

  private setRelations(relations) {
    localStorage.setItem(CACHE_RELATIONS, JSON.stringify(relations));
  }

  private outOfDate(date) {
    let seconde = 1000;
    let minute = 60 * seconde;
    let heure = 60 * minute;
    let jour = 24 * heure;
    return (Date.now() - date) > (20 * jour);
  }

  private checkDates(relations) {
    if (relations["d"] != null) {
      Object.entries(relations["d"]).forEach(values => {
        let key = values[0];
        let value = values[1];
        if (!isNaN(Number(key))) {
          if (this.outOfDate(value)) {
            this.deleteRelations(relations, key);
          }
        }
      });
      return relations;
    }
    return null;
  }

  private deleteRelations(relations, typeRelation) {
    if (relations[typeRelation] != null) {
      delete relations[typeRelation];
    }
    if (relations["d"] != null && relations["d"][typeRelation] != null) {
      delete relations["d"][typeRelation];
    }
  } 

  /*************************** COMPTEUR ***************************/
  private getCompteur(): number {
    let compteur = localStorage.getItem(CACHE_COMPTEUR);
    if (compteur == undefined) {
      compteur = "0";
    }
    return parseInt(compteur);
  }

  private setCompteur(n: number) {
    let compteur = n;
    if (compteur < 0) {
      compteur = 0;
    }
    localStorage.setItem(CACHE_COMPTEUR, compteur+"");
  }

  private incrCompteur(n: number) {
    this.setCompteur(this.getCompteur() + n);
  }

  private decrCompteur(n: number) {
    this.setCompteur(this.getCompteur() - n);
  }

}
