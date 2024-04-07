
import { LitElement, html, css } from 'lit';

//rpg-character web component import */
import "@lrnwebcomponents/rpg-character/rpg-character.js";

//ddd(design,develop,destroy) web component */
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
        }
        button {
           width: 10%;
           padding: var(--ddd-spacing-2, 12px 20px);
           margin: 8px 0;
           box-sizing: border-box;
           background-color: yellow;
           border-radius: 12px;
        }
        name  {
          padding: var(--ddd-spacing-3);
           color : var(--ddd-theme-default-beaverBlue);
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
        .user-char {
           margin: auto;
         }
        remove-item  {
         background-color: red;
         color: var(--ddd-theme-default-white); 
         padding: 12px 20px;
         margin: 8px 0;
         border-radius: 12px;
         width:40%;
        }
        remove-item:hover, button:hover {
                    background-color: var(--ddd-theme-default-potentialMidnight);
                    color: var(--ddd-theme-default-limestoneLight);
                    transform: scale(1.05);
                    transition: 0.3s ease-in-out;
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

    // to add a new user to the party */
    addItem(e) {
      // random number acts as the id/key */
      const randomNumber = globalThis.crypto.getRandomValues(new Uint32Array(1))[0];  
      const item = {
        id: randomNumber,
        }
      
      // add the user to the array */
      item.seed = this.input.value;
      if (this.input.value != "" ) {
        this.items = [...this.items,  item];
      }

      // reset screen, output to console */ 
      this.input.value = "";
      this.input.focus();
      console.log(this.items);
      /* once user added, place the new array into local storage and refresh screen */
      this.printitems = this.items;
      let string = JSON.stringify(this.items);    
      localStorage.setItem("userlist", string);
      this.requestUpdate();

    }
    
    // this method to identify the user that is removed */
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
       this.input.focus();
      /* once user removed, place the new array into local storage and refresh screen */
      this.printitems = this.items;
      let string = JSON.stringify(this.items);    
      localStorage.setItem("userlist", string);
       this.requestUpdate();
    }
    
    // get information from localstorage, if available */
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
        <input type="text" id="newitem" placeholder="Enter Username" value=${this.seed} onkeypress="return ( (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 32))" maxlength="8">
        <button @click="${this.addItem}">Add User</button>
        <button  @click="${this.saveAll}">Save all</button>
      </br>       
       <confetti-container id="confetti">
          ${this.items.map((item) => html`
          <div class = "user  ${item.seed}">
          <rpg-character class="userchar" seed="${item.seed}" hat="random"></rpg-character>
          <name>${item.seed}</name>
          <remove-item  @click="${this.targetClicked}" data-id="${item.id}"> Remove User</remove-item>
          </div>
         `)}
        </div>
        </confetti-container>
        <br>

        
      `;
    }

    /* when saved, throw an alert and */
    saveAll = () => {
      this.makeItRain(); 
      const str1 = 'Successfully saved the party! Members :';
      let len = this.items?.length;
      var newString = '';

      if (len > 0) {

          for (var i = 0; i < len; i++) {
              if (i + 1 == len) {
                  newString = newString.concat(`${this.items[i].seed}`)
              } else {
                  newString = newString.concat(`${this.items[i].seed} , `)
              }
          }
      }
      else {
        newString = 'None';
      }
      
      alert(str1.concat(newString));
      /* place the array into local storage and refresh screen */
      this.printitems = this.items;
      let string = JSON.stringify(this.items);    
      localStorage.setItem("userlist", string);
      this.requestUpdate();
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