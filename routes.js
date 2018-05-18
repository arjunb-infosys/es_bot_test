var express 		= require('express');
var session = require('express-session');
var router			= express.Router();	
router.use(session({secret: 'ssshhhhh'}));
var request			= require('request');	
var fs 				= require("fs");	
var request			= require('request');
var path			= require("path");	
var config			= require('./config');	
const uuidv1 		= require('uuid/v1');

//var Authentication = require('./utilities/Authentication');


//const sendOtp 		= new SendOtp('209393AILCgzYm2m675acd86a1');
router.get('/', function(req, res) {
	console.log('hari');
  res.redirect("/home.html");
});

router.get('/login',function(req,res){
	console.log("--------> sessionId <---------"+req.session.id);
	console.log("////req.session.userName/////"+req.session.userName);
	res.sendFile('public/login.html',{root: __dirname});
})

router.post('/botHandler',function(req, res){
		console.log("--------++ sessionId ++---------"+req.session.id);

	console.log('req received');
	console.log(JSON.stringify(req.body));
	var len = req.body.inputs.length;
	for(i=0; i<len; i++){		
		console.log(req.body.inputs[i].intent);
		if(req.body.inputs[i].intent == 'actions.intent.TEXT'){
			
	console.log("^^^^^^req.session.userName^^^^^^"+req.session.userName);
			dialogflowAPI(req.body.inputs[i].rawInputs[0].query)
			.then(function(resp){
				console.log(JSON.stringify(resp.result.fulfillment));
				resp.result.fulfillment.messages.forEach(function(message){
							
					if(message.platform=='google'&&message.type=="simple_response"){
						res.json(simpleResponse(message.textToSpeech)).end();
					}					
				})
				
			})
			break;
		}else if(req.body.inputs[i].intent == 'actions.intent.MAIN'){	
				req.session.userName="srihi";
	console.log("****req.session.userName*******"+req.session.userName);
		//	res.json(simpleResponse("Hi, I am leavebody what can I do for you")).end();
		res.send({
			"conversationToken": "",
			"expectUserResponse": true,
			"expectedInputs": [
				{
					"inputPrompt": {
						"richInitialPrompt": {
							"items": [
								{
									"simpleResponse": {
										"textToSpeech": "Math and prime numbers it is!"
									}
								},
								{
									"basicCard": {
										"title": "Math & prime numbers",
										"formattedText": "42 is an even composite number. It\n    is composed of three distinct prime numbers multiplied together. It\n    has a total of eight divisors. 42 is an abundant number, because the\n    sum of its proper divisors 54 is greater than itself. To count from\n    1 to 42 would take you about twenty-one…",
										"image": {
											"url": "https://example.google.com/42.png",
											"accessibilityText": "Image alternate text"
										},
										"buttons": [
											{
												"title": "Read more",
												"openUrlAction": {
													"url": "https://ttcb2b.herokuapp.com/login"
												}
											}
										],
										"imageDisplayOptions": "CROPPED"
									}
								}
							],
							"suggestions": []
						}
					},
					"possibleIntents": [
						{
							"intent": "actions.intent.TEXT"
						}
					]
				}
			]
		}).end();
			break;
		}
	}
	
	
});

var dialogflowAPI = function(input){
	
	return new Promise(function(resolve, reject){
		var options = { 
			method: 'POST',
			url: config.dialogflowAPI,
			headers: {
				"Authorization": "Bearer " + config.accessToken
			},
			body:{
				sessionId: uuidv1(),
				lang: "en",
				query:input
			},			
			json: true 
		}; 			
		console.log(options);
		request(options, function (error, response, body) {
			if(error){
				res.json({error:"error in chat server api call"}).end();
			}else{											
				resolve(body);
			}		
		});			
	});
}
var simpleResponse = function(responseText){
	console.log(responseText);
	return {
				"conversationToken": "",
				"expectUserResponse": true,
				"expectedInputs": [
					{
						"inputPrompt": {
							"richInitialPrompt": {
								"items": [
									{
										"simpleResponse": {
											"textToSpeech": responseText,
											"displayText": responseText
										}
									}
								],
								"suggestions": []
							}
						},
						"possibleIntents": [
							{
								"intent": "actions.intent.TEXT"
							}
						]
					}
				]
			};
}
module.exports = router;



			
