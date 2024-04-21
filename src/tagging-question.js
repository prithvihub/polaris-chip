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
        .tags {
        display: inline-block;
        margin: 8px 16px;
        border-radius: 50px;
        color: black;
        box-sizing: border-box;
        padding: 8px 24px;
        background-color: orange;
      }
       .checkBtn, .resetBtn {
        display: inline-block;
        margin: 12px 16px;
        border-radius: 100px;
        color: red;
        box-sizing: border-box;
        padding: 12px 24px;
        background-color: yellow;
      }


        `; 

    }
    constructor() {
      super();

      this.fetchjson();
      this.question = "Which of the following big ideas would YOU associate with this artistic work?";
      this.image = "https://oer.hax.psu.edu/bto108/sites/haxcellence/files/HAX.psu%20World%20changer-circle1.png";
      }

    fetchjson() {
      const buttonset = [];       
  /*    fetch('src/taginfo.json') */
      fetch('src/taginfo.json')
        .then(response => response.json())
        .then((json) =>
              {   const questionSet  = json.questionSet;   
                  const optionTags = this.shadowRoot.getElementById('optionTags');  
                           
                   for (const index in questionSet) {
                        const question = questionSet[index];
                        const button = document.createElement('button');
                        button.classList.add('tags');
                        button.textContent = index;
                        button.dataset.correct = question.correct;
                        button.dataset.feedback = question.feedback;
                        buttonset.push(button);
                     }
                    for (let i = buttonset.length - 1; i > 0; i--) { 
                      const j = Math.floor(Math.random() * (i + 1)); 
                      [buttonset[i], buttonset[j]] = [buttonset[j], buttonset[i]]; 
                    } 
                      
                  buttonset.forEach(button => {
                      optionTags.appendChild(button);


             });                       
       } )




    }

    

    render() {
        return html`
            <div id="question">
              <slot>${this.question}</slot>
            </div>
          
          <div id="Instruction">Click a chip to move from options to your choice. To undo, click on the chip to move it back to options area</div>     
          <div id="actions">
             <button id = "checkBtn" class="checkBtn" @click=${this.check}>
                  CHECK
              </button>
              <button id = "resetBtn" class="resetBtn" @click=${this.reset}>
                  RESET
              </button>
          </div>      
          <confetti-container id="confetti">
          <img id="image" src=${this.image}>
          <div id="optionsTagsArea">Options</div>
          <div id="optionTags" @click=${this.optionClicked} >
          </div>
              
          <div id="solutionTags" @click=${this.solutionClicked}>
              <div id="solutionTagsArea">Your Choice</div>
          </div>
          
          <div id="results"> </div>
       
          

          </confetti-container>

      `;
    }


    solutionClicked(event) {
      this.clickedItem = event.target;
        const solutionTags = this.shadowRoot.getElementById('solutionTags');
        const optionTags = this.shadowRoot.getElementById('optionTags');
  
        if(this.clickedItem.classList.contains('tags')) {
          this.clickedItem.remove();
          optionTags.append(this.clickedItem);
        }
      
    }
    optionClicked(event) {
      this.clickedItem = event.target;
      
        const solutionTags = this.shadowRoot.getElementById('solutionTags');
  
        if(this.clickedItem.classList.contains('tags')) {
          this.clickedItem.remove();
          solutionTags.append(this.clickedItem);
        }
      
    }

    check() {
      this.shadowRoot.querySelector('#results').innerHTML += `<p>Results : </p>`;
      var allCorrect = true;
       const solutionTags = this.shadowRoot.querySelectorAll('#solutionTags .tags');
       for (const tag of solutionTags) {
          var isCorrect = false;
          if (tag.dataset.correct == 'true'){ isCorrect = true ; }
          if(isCorrect){
             tag.style.color = "green";
             this.shadowRoot.querySelector('#results').innerHTML += `<p style="background-color:green">${tag.textContent} - ${tag.dataset.feedback}</p>`;
            }
          else {
             var allCorrect = false;
             tag.style.color = "red";
             tag.title = tag.dataset.feedback;
             this.shadowRoot.querySelector('#results').innerHTML += `<p style="background-color:red">${tag.textContent} - ${tag.dataset.feedback}</p>`;
          }
        }

       const optionTags = this.shadowRoot.querySelectorAll('#optionTags .tags');
       for (const tag of optionTags) {
         var isCorrect = false;
         if (tag.dataset.correct == 'true'){ isCorrect = true ; }
         if(isCorrect){
           var allCorrect = false;   
           tag.style.color = "red";        
           tag.title = tag.dataset.feedback;
           this.shadowRoot.querySelector('#results').innerHTML += `<p style="background-color:red">${tag.textContent} -${tag.dataset.feedback}</p>`;
         }
       }
       const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
       checkBtn.forEach(btn => {
               btn.disabled = true; });
       if ( allCorrect == true ) {
        this.makeItRain();
       }
    }
    reset() {
      this.shadowRoot.querySelector('#results').innerHTML = ``;
      const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
      checkBtn.forEach(btn => {
          btn.disabled = false;
      });



      const optionTags = this.shadowRoot.querySelectorAll('#optionTags .tags');
      for (const tag of optionTags) {
        tag.remove();
      }    
      const solutionTags = this.shadowRoot.querySelectorAll('#solutionTags .tags');
      for (const tag of solutionTags) {
        tag.remove();
      }            
      this.fetchjson();

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