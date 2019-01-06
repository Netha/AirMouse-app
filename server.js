var static = require('node-static');
var file = new static.Server(`${__dirname}/client`)

console.log('http side server is runing...');

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume()
}).listen(8080)




var robot = require("robotjs");

// Speed up the mouse.
robot.setMouseDelay(2);

const server = require('http').createServer();
const client = require('socket.io')(server);

client.on('connection', socket => {
    console.log('Socket service is running...');
  client.on('connect', function () {
    client.emit('status', 'online')
  })
  socket.on('disconnect', function(){
    client.emit('status','offline')
  })
  let betaMinVal = 5;
  let betaTotalRange = 20;

  let alphaMinVal = 5;
  let alphaTotalRange = 30;


  let _firstAlpha;
  let _alpha;
  let _beta;
  let p_beta;
  let p_alpha;



  socket.on('input', data => {

    // console.log(`${data.alpha} , ${data.beta} `);
    
    _alpha = data.alpha;
    _beta = data.beta;
    _firstAlpha = data.f_alpha;
    console.log('first: ' + _firstAlpha );
    


    // Y-axis (Beta)
    _beta = _beta + betaMinVal;  // Make it positivie start.
    if(_beta < 0 ){ _beta = 0}   // Don't accept low more then 0  to the precent estimation. 
    if(_beta > (betaMinVal+betaTotalRange)) { _beta = (betaMinVal+betaTotalRange) }
    p_beta = _beta/(betaMinVal+betaTotalRange)*100; // Relative position. 

    // X-axis (Alpha)
    _alpha = _alpha - _firstAlpha;  // Make it start a 0.       
    _alpha = _alpha + alphaMinVal; // Make it positivie start. 
    if(_alpha < 0) { _alpha = 0 }  // Don't accept low more then 0  to the precent estimation. 
    if(_alpha > (alphaMinVal+alphaTotalRange)){ _alpha = (alphaMinVal+alphaTotalRange) }
    p_alpha = _alpha / (alphaMinVal+alphaTotalRange) *100;
      
    let screenSize = robot.getScreenSize();

    let mouseXpos = Math.round(screenSize.width*p_alpha/100 -screenSize.width)*-1;
    let mouseYpos = Math.round(screenSize.height*p_beta/100-screenSize.height)*-1 ;

  //console.log(`Position on screen: Y:${mouseYpos}px , X:${mouseXpos}px | y: ${Math.round(p_beta)}% , x:${Math.round(p_alpha)}%`);
   
  robot.moveMouse(mouseXpos ,mouseYpos);

    //  client.emit('output', data)
  })

  socket.on('click', data => {
    robot.mouseClick();
    console.log('click');

  })
  
})
client.listen(81);
