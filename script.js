const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay =document.querySelector("[data-lengthNumber]");
const passwordDisplay =document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck =document.querySelector("#uppercase");
const lowercaseCheck =document.querySelector("#lowercase");
const NumbersCheck =document.querySelector("#numbers");
const symbolsCheck =document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generate-btn");
const allcheckBox =document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_-+={}[]\<,>?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set strength circle color to grey
setIndicator("#ccc");
//Set Password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    //or kuch bhi karna chahiyte
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow='0px 0px 12px 1px $(color)';
}

function getRandomInteger(min,max){
   //return Math.floor(Math.random*(max-min))+min;
   return Math.floor(Math.random() * (max - min) + min);
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowercase(){
    return  String.fromCharCode(getRandomInteger(97,123));   
}

function generateUppercase(){
    return  String.fromCharCode(getRandomInteger(65,90));   
}

function generatesymbols(){
    const ranNom=getRandomInteger(0,symbols.length);
    return symbols.charAt(ranNom); 
}

function calcStrength(){
    let hasUpper=false;
    let haslower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper =true;
    if(lowercaseCheck.checked) haslower =true;
    if(NumbersCheck.checked) hasNum =true;
    if(symbolsCheck.checked) hasSym =true;

    if(hasUpper && haslower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0")
    }else if((haslower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0")
    } else {
        setIndicator("#f00")
    }
}

async function copycontent(){
   try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="Copied"
   }

   catch(e){
        copyMsg.innerText="Failed"
   }
   // to make copy wala span visible
   copyMsg.classList.add("active");

   setTimeout( () =>{
    copyMsg.classList.remove("active")
   },2000); 
} 

function shufflePassword(array){
    console.log("array " , array);
    //Fisher Yates method
    for(let i=array.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp= array[i];
        array[i]=array[j];
        array[j]=temp;
    }

    console.log("sufflrd array", array);
    let str="";
    array.forEach((el)=>{
        str+=el;
        

    })

    return str;
}

function handleChechBoxChange(){
    checkCount=0;
    allcheckBox.forEach( (checkbox)=>{
        if(checkbox.checked)
        checkCount ++;
    });
    //special condition
    if(passwordLength<checkCount)
    passwordLength=checkCount;
    handleSlider();
}

allcheckBox.forEach( (checkbox)=>{
    checkbox.addEventListener('change',handleChechBoxChange);
})


inputSlider.addEventListener('input', (e)=>{
    passwordLength=e.target.value;
    handleSlider();

})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) 
    copycontent();
})

generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount==0) 
    return;
    if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
    }
    // lets start the journey to find new password
    console.log("starting the journey");

    // remove old password
    password="";

    // lets  put the stuff mentionede by checkBoxes
    // if(uppercaseCheck.checked){
    //     password+=generateUppercase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generatelowercase();
    // }
    // if(NumbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generatesymbols();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(NumbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generatesymbols);
    }
    //compulsary add items
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("compulsary addition done")
    for(let i=0;i<passwordLength-funcArr.length;i++){
        console.log("hola -->>>>",funcArr.length);
        let randIndex=getRandomInteger(0,funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex](); 
    }
    console.log("remaining addition done");

    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("shuffling addition done",password);
    //show in UI

    passwordDisplay.value=password;
    console.log("UI addition done");
    //calculate strength
    calcStrength();


})
