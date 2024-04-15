import { LitElement, html, css } from 'lit';
//ddd(design,develop,destroy) web component */
import { DDD } from '../node_modules/@lrnwebcomponents/d-d-d/d-d-d.js';

export class TaggingQuestion extends DDD {

    static get tag()
    {
        return 'tagging-question';
    }
    static get styles()
    {
        return css`
        :host {
          display: block
        }
        
        img {
            max-height: 300px;
            object-fit: contain;
            max-width: 100%;
            padding: 8px;
        }
        .boxB {
        display: inline-block;
        margin: 4px 16px;
        border-radius: 100px;
        color: green;
        box-sizing: border-box;
        padding: 4px 12px;
      }

        `; 

    }
    constructor() {
        super();
      
        fetch('src/taginfo.json')
          .then(response => response.json())
          .then((json) =>
                {   const questionSet  = json.questionSet;   
                    const optionTags = this.shadowRoot.getElementById('optionTags');  
                    const buttons = [];                
                     for (const index in questionSet) {
                          const question = questionSet[index];
                          const button = document.createElement('button');
                          button.classList.add('boxB');
                          button.textContent = index;
                          button.dataset.correct = question.correct;
                          button.dataset.feedback = question.feedback;
                          buttons.push(button);
                       }
                    buttons.forEach(button => {
                    optionTags.appendChild(button);
             });                       
                } )


        }



    

    render() {
        return html`

          <div id="question">${this.question}</div>
          <img id="image" src=${this.image}>

          <div id="optionTags"></div>

          <div id="actions">

              <button  @click=${this.check}>
                  CHECK
              </button>
              <button  @click=${this.reset}>
                  RESET
              </button>
          </div>

      `;
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
          question: { type: String},
          image:{ type: String}
        };
      }  


}
 globalThis.customElements.define('tagging-question', TaggingQuestion);