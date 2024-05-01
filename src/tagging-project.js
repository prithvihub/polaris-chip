import { LitElement, html, css } from 'lit';
//ddd(design,develop,destroy) web component */
import { DDD } from '@lrnwebcomponents/d-d-d';

export class TaggingQuestion extends DDD {

    static get tag()
    {
        return 'tagging-question';
    }
    static get styles()
    {
        return css`
        :host {
            display: block;
        }
        
        img {
            border-color: var(--ddd-theme-default-potentialMidnight);
            box-sizing: border-box;
            display: inline-block;
            border: solid;
            color: pink;                       
            max-height: 300px;
            object-fit: contain;
            max-width: 100%;
            padding: 8px;
            margin-left: 20%;
            margin-right: auto;
        }
        .tags {
            display: inline-block;
            margin: 8px 16px;
            border-radius: 50px;
            color: var(--ddd-theme-default-black);
            box-sizing: border-box;
            padding: 8px 24px;
            background-color: orange;
        }
       .checkBtn, .resetBtn {
            display: inline-block;
            margin: 12px 16px;
            border-radius: 100px;
            color: white;
            box-sizing: border-box;
            padding: 12px 24px;
            background-color: blue;
        }

       #optionTags , #solutionTags {
            box-sizing: border-box;
            display: inline-block;
            border: solid;
            color: purple;
            justify-content: center;   
        }       
       `; }
    constructor() {
      super();
      this.question = 'Default Question';
      this.imageURL = "";
      this.source =  new URL('../src/taginfo.json', import.meta.url).href;
      this.currentTag;
      this.checked = false;
      this.imageURL = "https://oer.hax.psu.edu/bto108/sites/haxcellence/files/HAX.psu%20World%20changer-circle1.png";
    }
    connectedCallback() {
      super.connectedCallback();
      this.source =  new URL('../src/taginfo.json', import.meta.url).href;
      this.question = "Which of the following big ideas would YOU associate with this artistic work?";


      const buttonset = [];
      
      fetch(this.source)
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
                        button.draggable = true;
                        button.addEventListener('dragstart', this.handleDragStart.bind(this));
                        buttonset.push(button);
                     }
                    for (let i = buttonset.length - 1; i > 0; i--) { 
                      const j = Math.floor(Math.random() * (i + 1)); 
                      [buttonset[i], buttonset[j]] = [buttonset[j], buttonset[i]]; 
                    } 
                      
                  buttonset.forEach(button => {
                      optionTags.appendChild(button);

                  const slottedImage = this.querySelector('image');
                  if(slottedImage) {
                     this.imageURL = slottedImage.src;
                  }

             });                       
       } ) 
    }

    

    render() {
        return html`
            <div id="question" >
              <slot>${this.question}</slot>
            </div>
          
          <div id="Instruction">Click or drag the chip to move from options to your choice. You can  undo a chip action or Reset all</div>     
          <div id="actions">
              <button id = "resetBtn" class="resetBtn" @click=${this.reset}>
                  RESET
              </button>            
              <button id = "checkBtn" class="checkBtn" @click=${this.check}>
                  CHECK
              </button>

          </div>      
          <confetti-container id="confetti">
          <img id="image" src=${this.imageURL}>
          <div id="optionsTagsArea">Options</div>
          <div id="optionTags" @click=${this.optionClicked} @dragover=${this.handleDragOverReverse} @drop=${this.handleDropReverse} >
          </div>
          <br><br>
          <div id="solutionTagsArea">Your Choice</div>
          <div id="solutionTags" @click=${this.solutionClicked} @dragover=${this.handleDragOver} @drop=${this.handleDrop}>              
              <div id="dropTagHere">  [Drop chip here] &ensp;&ensp;&ensp;<br><br></div>
          </div>
          
          <div id="results"> </div>
        </confetti-container>

      `;
    }

  handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.textContent);
    this.currentTag = event.target;
  }
  handleDragStartReverse(event) {
    event.dataTransfer.setData('text/plain', event.target.textContent);
    this.currentTag = event.target;
  }

    handleDropReverse(event) {
      event.preventDefault();
      const button = this.currentTag;
      const optionTags = this.shadowRoot.getElementById('optionTags');  
      const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
      checkBtn.forEach(btn => {
          if (btn.style.visibility == "" || btn.style.visibility == "visible") {
            button.remove();
            optionTags.append(button);   
          }
      });      
    }
    handleDrop(event) {
      event.preventDefault();
      const button = this.currentTag;
      const solutionTags = this.shadowRoot.getElementById('solutionTags');  
      const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
      checkBtn.forEach(btn => {
          if (btn.style.visibility == "" || btn.style.visibility == "visible") {
            button.remove();
            solutionTags.append(button);          
          }
      });

    }

    handleDragOver(event) {
      event.preventDefault();
    }

    handleDragOverReverse(event) {
      event.preventDefault();
    }

    solutionClicked(event) {
        this.clickedItem = event.target;
        const optionTags = this.shadowRoot.getElementById('optionTags');
  
        if(this.clickedItem.classList.contains('tags')) {
          const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
          checkBtn.forEach(btn => {
              if (btn.style.visibility == "" || btn.style.visibility == "visible") {
                this.clickedItem.remove();
                optionTags.append(this.clickedItem);
                }
              });                  
        }
      
    }
    optionClicked(event) {
        this.clickedItem = event.target;
        const solutionTags = this.shadowRoot.getElementById('solutionTags');
        if(this.clickedItem.classList.contains('tags')) {
          const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
          checkBtn.forEach(btn => {
              if (btn.style.visibility == "" || btn.style.visibility == "visible") {
                  this.clickedItem.remove();
                  solutionTags.append(this.clickedItem);
                }
              });         
        }
    }

    check() {

      var allCorrect = true;
       const solutionTags = this.shadowRoot.querySelectorAll('#solutionTags .tags');
       if ( solutionTags.length == 0 ) {alert ("choose at least one option! "); return;} ;

       this.shadowRoot.querySelector('#results').innerHTML += `<p>Results : </p>`;
       for (const tag of solutionTags) {
          var isCorrect = false;
          if (tag.dataset.correct == 'true'){ isCorrect = true ; }
          if(isCorrect){
             tag.style.background = "green";
             tag.title = tag.dataset.feedback;
             this.shadowRoot.querySelector('#results').innerHTML += `<p style="background-color:green">Correct : ${tag.textContent} - ${tag.dataset.feedback}</p>`;
            }
          else {
             var allCorrect = false;
             tag.style.background = "red";
             tag.title = tag.dataset.feedback;
             this.shadowRoot.querySelector('#results').innerHTML += `<p style="background-color:red">Incorrect : ${tag.textContent} - ${tag.dataset.feedback}</p>`;
          }
        }

       const optionTags = this.shadowRoot.querySelectorAll('#optionTags .tags');
       for (const tag of optionTags) {
         var isCorrect = false;
         if (tag.dataset.correct == 'true'){ isCorrect = true ; }
         if(isCorrect){
           var allCorrect = false;
         }
       }
       const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
       checkBtn.forEach(btn => {
        btn.style.visibility =  "hidden"; });
       if ( allCorrect == true ) {
        this.makeItRain();
       }
    }


    reset() {
      this.shadowRoot.querySelector('#results').innerHTML = ``;
      const checkBtn = this.shadowRoot.querySelectorAll('.checkBtn');
      checkBtn.forEach(btn => {
          btn.style.visibility = "visible";
      });
      const optionTags = this.shadowRoot.querySelectorAll('#optionTags .tags');
      for (const tag of optionTags) {
        tag.remove();
      }    
      const solutionTags = this.shadowRoot.querySelectorAll('#solutionTags .tags');
      for (const tag of solutionTags) {
        tag.remove();
      }            
      this.connectedCallback();

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
          source:{type: String},
          imageURL:{ type: String}
        };
      }  


}
 globalThis.customElements.define('tagging-question', TaggingQuestion);