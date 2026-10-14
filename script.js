const questions = [
 {type:'choice', title:'What makes a great school day?', subtitle:'Choose the answer that fits you best.', options:['Creative lessons','Time with friends','Learning something new','A little bit of everything']},
 {type:'text', starter:'WHO?', title:'Who is someone in class who makes people laugh?', subtitle:'Type a name or nickname. Keep it kind.'},
 {type:'choice', title:'Which subject do you enjoy most?', subtitle:'Choose one.', options:['Maths','Science','English / Languages','Art / Music','PE / Sport','Another subject']},
 {type:'text', starter:'WHAT?', title:'What is one thing you would improve about our class?', subtitle:'Share an idea, not an insult.'},
 {type:'choice', title:'How do you prefer working in class?', subtitle:'Pick your usual style.', options:['Working alone','With a partner','In a small group','As a whole class']},
 {type:'text', starter:'WHO?', title:'Who would you choose as a teammate for a class challenge?', subtitle:'You can enter a classmate’s name and say why.'},
 {type:'choice', title:'What kind of class activity sounds best?', subtitle:'Choose one.', options:['A quiz game','A creative project','A debate or discussion','A sports challenge','A class trip']},
 {type:'text', starter:'WHAT?', title:'What classroom behaviour annoys you the most?', subtitle:'Describe the behaviour, not a person. Please don’t use this to target a classmate.'},
 {type:'choice', title:'How would you describe our class vibe?', subtitle:'Pick the closest match.', options:['Funny and energetic','Friendly and supportive','Competitive','Quiet and focused','A mix of everything']},
 {type:'text', starter:'WHAT?', title:'What is one kind or funny memory you have from our class?', subtitle:'Keep it respectful so everyone feels welcome.'}
];
let username = '', current = 0, answers = Array(questions.length).fill(null);
const $ = id => document.getElementById(id);
const joinForm = $('joinForm'), surveyArea = $('surveyArea'), finishArea = $('finishArea');
function show(el){el.classList.remove('hidden');}
function hide(el){el.classList.add('hidden');}
function startSurvey(event){
 event.preventDefault();
 username = $('username').value.trim().replace(/\\s+/g,' ');
 if(username.length < 2){$('username').focus();return;}
 current=0; answers=Array(questions.length).fill(null);
 hide($('join').querySelector('.section-intro')); hide($('join').querySelector('.join-panel'));
 show(surveyArea); hide(finishArea); renderQuestion();
 surveyArea.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderQuestion(){
 const q=questions[current];
 $('progressLabel').textContent=`QUESTION ${current+1} OF ${questions.length}`;
 $('progressBar').style.width=`${((current+1)/questions.length)*100}%`;
 $('questionType').textContent=q.type==='choice'?'CHOOSE ONE ANSWER':`${q.starter} — TYPE YOUR ANSWER`;
 $('questionTitle').textContent=q.title;
 $('questionSubtitle').textContent=q.subtitle;
 $('answerError').textContent='';
 $('backButton').disabled=current===0;
 $('nextButton').innerHTML=current===questions.length-1?'Finish survey ✓':'Next question →';
 const area=$('answerOptions'); area.innerHTML='';
 if(q.type==='choice'){
  q.options.forEach((option,i)=>{
   const label=document.createElement('label');label.className='answer-option'+(answers[current]===option?' selected':'');
   const input=document.createElement('input');input.type='radio';input.name='choice';input.value=option;input.checked=answers[current]===option;
   input.addEventListener('change',()=>{answers[current]=option;area.querySelectorAll('.answer-option').forEach(x=>x.classList.remove('selected'));label.classList.add('selected');$('answerError').textContent='';});
   label.append(input,document.createTextNode(option));area.append(label);
  });
 } else {
  const textarea=document.createElement('textarea');textarea.className='typed-answer';textarea.maxLength=240;textarea.placeholder='Type your answer here…';textarea.value=answers[current]||'';textarea.required=true;
  textarea.addEventListener('input',()=>{answers[current]=textarea.value;$('answerError').textContent='';});area.append(textarea);
 }
}
joinForm.addEventListener('submit',startSurvey);
$('answerForm').addEventListener('submit',event=>{
 event.preventDefault();const q=questions[current];let value=answers[current];
 if(q.type==='text'){value=(value||'').trim();answers[current]=value;}
 if(!value){$('answerError').textContent=q.type==='choice'?'Please choose an answer before continuing.':'Please type an answer before continuing.';return;}
 if(current<questions.length-1){current++;renderQuestion();}else{showFinish();}
});
$('backButton').addEventListener('click',()=>{if(current>0){current--;renderQuestion();}});
function showFinish(){
 hide(surveyArea);show(finishArea);$('finishName').textContent=username;$('finishUser').textContent=username;
 $('reviewList').innerHTML='<h3>Your answers</h3>'+questions.map((q,i)=>`<div class="review-item"><b>${i+1}. ${escapeHtml(q.title)}</b><p>${escapeHtml(String(answers[i]||''))}</p></div>`).join('');
 hide($('reviewList'));$('reviewButton').textContent='Review my answers ↗';finishArea.scrollIntoView({behavior:'smooth',block:'start'});
}
function escapeHtml(value){return value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
$('reviewButton').addEventListener('click',()=>{const list=$('reviewList');list.classList.toggle('hidden');$('reviewButton').textContent=list.classList.contains('hidden')?'Review my answers ↗':'Hide my answers ↑';});
$('restartButton').addEventListener('click',()=>{hide(finishArea);show($('join').querySelector('.section-intro'));show($('join').querySelector('.join-panel'));$('username').value=username; $('join').scrollIntoView({behavior:'smooth'});});
