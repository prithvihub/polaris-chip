import { LitElement, html, css } from 'lit';

export class Counter extends LitElement{
    static get tag()
    {
        return 'counter-app';
    }

    constructor()
    {
        super();
        this.title = 'Counter';
        this.counter = 15;
        this.max = 25;
        this.min = 10;
        this.link = '#';
    }

    static get styles()
    {
        return css`
#counter {
  background-color : cyan;
  border: none;
  padding: 16px 16px;
  text-decoration: none;
  margin: 8px 4px;
  cursor: pointer;
  font-size : 80px; width : 100%;
  color: red;
  text-align: center;
}

.buttons {
			display: flex;
			gap: 16px;
		}
.button {
  background-color : yellow;
  border: none;
  padding: 16px 32px;
  text-decoration: none;
  margin: 8px 4px;
  cursor: pointer;
  font-size : 40px;
}

.button:hover {
  background-color: #04AA6D;
  color: white;
}
.button:focus {
   color: red;     }  
   `  } 

    render()
    {
        return html`
		<div class="container">		 
            <confetti-container id="confetti">
        	<h2 id="counter">${this.counter}</h2>
			<div class="buttons">
                <button class="button" ?disabled="${this.counter === this.max}" @click=${this.onIncrementClick}>+</button>
                <button class="button" ?disabled="${this.counter === this.min}" @click=${this.onDecrementClick}>-</button>
			</div>
      </confetti-container>
        </div>     
        `;
      
    }
	onIncrementClick = () => {
		this.counter++;
        if (this.counter == 18 || this.counter == 21 || this.counter == this.max || this.counter == this.min )
          { this.shadowRoot.querySelector("#counter").style.color = "green"; }
        else
          { this.shadowRoot.querySelector("#counter").style.color = "red"; } 
		this.render();
	}

	onDecrementClick = () => {
		this.counter = this.counter - 1;
        if (this.counter == 18 || this.counter == 21 || this.counter == this.max || this.counter == this.min )
          { this.shadowRoot.querySelector("#counter").style.color = "green"; }
        else
          { this.shadowRoot.querySelector("#counter").style.color = "red"; }  
		this.render();
	}
    updated(changedProperties) {
      if (changedProperties.has('counter')) {
        if (this.counter == 21) {
        this.makeItRain(); }   
     }
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
          // this is a String. Array, Object, Number, Boolean are other valid values here
          counter: { type: Number, reflect: true},
          max: { type: Number, reflect: true},
          min: { type: Number, reflect: true},
      }
    }
}

globalThis.customElements.define(Counter.tag, Counter);