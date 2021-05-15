let inpStr=[];
let totalFiles = 1;
let frequencyArray = [];
let strengthArray = [];

const hLinePhoton = 1420.4057517667;//MHZ
const lightSpeed = 299792458;//MS^-1


function preload()
{
  for(let i=0; i<totalFiles; i++)
  {
    let tempNameStr = 'lapse1_'+ '000' +(totalFiles);
    inpStr.push(loadStrings('lapseFiles/'+tempNameStr+'.txt'));
  }
}

function setup()
{
  //dumbass manoevers below
  //
  console.log(inpStr[0][0]);
  createCanvas(800,500);
  splitInc(inpStr);

}

function draw()
{
  background(255);
  drawGraph(frequencyArray[0],strengthArray[0]);
}

//Convert table into two tables -- one for frequency and one for data
function splitInc(inp2DArray)
{
  for(let i=0; i<totalFiles; i++)
  {
    frequencyArray.push([]);
    strengthArray.push([]);
    for(let j=0; j<inp2DArray[i].length; j++)
    {
        frequencyArray[i][j]= inp2DArray[i][j].substr(0,15);
        strengthArray[i][j]=inp2DArray[i][j].substr(16,29);
    }
  }
  frequencyArray[0].splice(0,1);
  strengthArray[0].splice(0,1);
  frequencyArray = convertToFloat(frequencyArray);
  strengthArray = convertToFloat(strengthArray);
}

///Draw graph of a H-line plot
function drawGraph(inpArrayF,inpArrayS)
{
  let xDif = 100;
  let yDif = 100;
  let normalizedFreqs =[];
  let normalizedStregs = [];
  let freqVelocities = findVelocities(inpArrayF);
  for(let i=0; i<inpArrayF.length; i++)
  {
    normalizedFreqs.push(map(inpArrayF[i],1418.9,1421.31,xDif,width-xDif));
    normalizedStregs.push(map(inpArrayS[i],0,0.1,height-yDif,yDif));
    stroke(0,255,0);
    point(normalizedFreqs[i],normalizedStregs[i]);
  }
  stroke(0);
  line(xDif,height-yDif,width-xDif,height-yDif);
  line(xDif,height-yDif,xDif,yDif);
  text("Velocity / km(s^-1)",width/2,height-yDif/2);
  text("Signal strength",xDif/8,height/2);
  //console.log(freqVelocities[511]);

  text(freqVelocities[400],xDif+50,height-yDif/1.2);
}

function findVelocities(inpArrayF)
{
  let velocities = [];
  for(let i=0; i<inpArrayF.length; i++)
  {
    //Calculate doppler shift
    let freqRatio = hLinePhoton/inpArrayF[i];
    freqRatio = freqRatio*freqRatio;
    let cRatio = freqRatio/(1+freqRatio);
    let velocity = cRatio * lightSpeed;
    //console.log(cRatio);
    velocities.push(velocity);
  }
  return velocities;
}

function convertToFloat(inpArray)
{
  let output = [];
  for(let i=0; i<inpArray.length; i++)
  {
    output.push(float(inpArray[i]));
  }
  return output;
}
