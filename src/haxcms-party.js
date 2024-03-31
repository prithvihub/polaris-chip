
import { LitElement, html, css } from 'lit';
import "../node_modules/@lrnwebcomponents/rpg-character/rpg-character.js";
import  "../node_modules/@lrnwebcomponents/d-d-d/d-d-d.js";
import { DDD } from '../node_modules/@lrnwebcomponents/d-d-d/d-d-d.js';

export class HaxCmsParty extends DDD {

    static get tag()
    {
        return 'haxcms-party-ui';
    }
    
    static get styles()
    {
      return css`
        :host {
          display: block
        }
        input[type=text] {
           margin: var(--ddd-spacing-4);
           padding: var(--ddd-spacing-5);
           width: 25%;      
           box-sizing: border-box;
           align-content: center;
        }
        button {
           width: 15%;
           padding: 12px 20px;
           margin: 8px 0;
           box-sizing: border-box;
           background-color: yellow;
           border-radius: 12px;
        }
        name  {
           padding: 10px;
        }
        .user {
            margin: 10px;
            display: inline-flex;
            flex-wrap: wrap;
            text-align: center;
            border: var(--ddd-border-md);
            border-radius: 5px;
            border-color: var(--ddd-theme-default-potentialMidnight);
            padding: 12px 20px;
          }
        remove-item  {
         background-color: red;
         color: white;
         padding: 12px 20px;
         margin: 8px 0;
         border-radius: 12px;
         width: 50%;
        }
        remove-item:hover, button:hover {
                    background-color: var(--ddd-theme-default-potentialMidnight);
                    color: var(--ddd-theme-default-limestoneLight);
                }
      `; 
    }
    

    constructor() {
      super();      
      // MUST have array initialized as empty or it'll break in console
      this.items = [];
    }

    get input() {
      return this.renderRoot?.querySelector('#newitem') ?? null;
    }

    addItem(e) {
      const randomNumber = globalThis.crypto.getRandomValues(new Uint32Array(1))[0];  
      const item = {
        id: randomNumber,
        }
      item.seed = this.input.value;
      if (this.input.value != "" ) {
        this.items = [...this.items,  item];
      }
      this.input.value = "";
      console.log(this.items);
      this.printitems = this.items;
      let string = JSON.stringify(this.items);    
      localStorage.setItem("userlist", string);
      this.requestUpdate();
    }
  
    targetClicked(e) {

      // another way of finding the index that matches what was clicked if you have a unique value in your items as added
      // which... seed / name of the user should be enforced to be unique so.....
      const index = this.items.findIndex((item) => {
        return item.id === parseInt(e.target.closest('remove-item').getAttribute('data-id'));
      });
      console.log(index);
      if (index > -1) {
         const previousSecondElementOfTheArray = this.items.splice(index, 1);
       }
       this.printitems = this.items;
       let string = JSON.stringify(this.items);    
       localStorage.setItem("userlist", string);
       this.requestUpdate();
    }
    
    firstUpdated() {

      let retString = localStorage.getItem("userlist");
      this.printitems = JSON.parse(retString);
      if (this.printitems === undefined || this.printitems.length == 0) {
      }
      else {
        this.items = this.printitems;
      };


    }

    render() {
      return html`
        <input type="text" id="newitem" value=${this.seed} onkeypress="return ( (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))" maxlength="8">
        <button @click="${this.addItem}">Add User</button>
        </br>       
       <confetti-container id="confetti">
          ${this.items.map((item) => html`
          <div class = "user  ${item.seed}">
          <rpg-character seed="${item.seed}" hat="random"></rpg-character>
          <name>${item.seed}</name>
          <remove-item  @click="${this.targetClicked}" data-id="${item.id}"> Remove user</remove-item>
          </div>
         `)}
        </div>
        </confetti-container>
        <br>

        <button  @click="${this.saveAll}">Save all</button>
      `;
    }

    saveAll = () => {
      this.makeItRain(); 
      alert("Successfully saved the party!");
    }    

    makeItRain() {
      // this is called a dynamic import. It means it won't import the code for confetti until this method is called
      // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
      // will only run AFTER the code is imported and available to us
      
      import("@lrnwebcomponents/multiple-choice/lib/confetti-container.js").then(
        (module) => {
          // This is a minor timing 'hack'. We know the code library above will import prior to this running
          // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
          // this "hack" ensures the element has had time to process in the DOM so that when we set popped
          // it's listening for changes so it can react
          setTimeout(() => {
            // forcibly set the poppped attribute on something with id confetti
            // while I've said in general NOT to do this, the confetti container element will reset this
            // after the animation runs so it's a simple way to generate the effect over and over again
            this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
          }, 0);
        }
      ); 
    }  

    static get properties() {
      return {
        seed: { type: String, reflect: true },
        items: {type: Array},
        printitems: {type: Array}
      };
    }  

  }

  globalThis.customElements.define('haxcms-party-ui', HaxCmsParty);