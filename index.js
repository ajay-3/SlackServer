var express = require('express');
var bodyParser = require("body-parser");
var cors = require('cors');
var axios = require('axios');

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port',(process.env.PORT||80));


app.post('/events', async(req, res) => {
    switch (req.body.type) {
      case 'url_verification': {
        console.log(req.body);
        // verify Events API endpoint by returning challenge if present
        res.send({ challenge: req.body.challenge });
        break;
      }
      case 'event_callback': {
        // Verify the signing secret
          const type = req.body.event.type;
          // Triggered when the App Home is opened by a user
          if(type === 'app_home_opened') {
            // Display App Home
            console.log(req.body)
           var value={
            "blocks": [
              {
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "Nice you have successfully installed the Feedback for Slack.Type '/help' to see what *Feedback can do for you* \n\n *Connect your Feedback channel*"
                }
              },
              {
                "type": "section",
                "block_id": "section678",
                "text": {
                  "type": "mrkdwn",
                  "text": "Logged in as"
                }
              },
                  {
                    "type": "actions",
                "elements": [
                  {
                    "type": "conversations_select",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Feedback Channel",
                    "emoji": true
                    }
                  },
                  {
                    "type": "channels_select",
                  "placeholder": {
                    "type": "plain_text",
                    "text": "Send your DMs",
                    "emoji": true
                  }
                  }
                ]
                  },
              {
                "type": "divider"
              }
            ]
          };
            var result = await axios.post("https://hooks.slack.com/services/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",value);
            try {
              if(result.data.error) {
                console.log(result.data.error);
              }
            } catch(e) {
              console.log(e);
            }
          }
        
        break;
      }
      default: { res.sendStatus(404); }
    }
  });

app.post('/actions',async(req,res)=>{
  var data =JSON.parse(req.body.payload);
if(data.type=="view_submission"){
  res.send("");
  var title_value=data.view.state.values.title_id["title-value"].value;
  var desc_value =data.view.state.values.desc_id.desc_value.value;
  var channel_id = "CTUTEBSCS";
  finalMessage(channel_id,title_value,desc_value);
}else if(data.type=="block_actions"){
  if(data.actions[0].type=="channels_select"){
        channel = data.actions[0].selected_channel;
  }else if(data.actions[0].type="conversations_select"){
        console.log(req.body)
        workspace =data.actions[0].selected_conversation;
  }
  if(channel && workspace){
    var deleteUrl = "https://slack.com/api/chat.delete";
    var ts = data.container.message_ts;
    var channel_delete = data.container.channel_id;
    var delete_body={
      "ts":ts,
      "channel":channel_delete
    }
    const headers_value = {
      'Content-type': 'application/json',
      'Authorization': 'Bearer xoxp-948251840291-959719953952-947833017538-7a3d0397a2c50db2448c00c1f45bc70a'
    }
    var delete_result = await axios.post(deleteUrl,delete_body,{headers:headers_value});
    var url = data.response_url;
      var finalBlock ={
        "replace_original": "true",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Nice you have connected to " + workspace +"  through  "+channel
            }
          }
        ]
      };
      var resultHere = await axios.post(url,finalBlock,{headers:headers_value})
  } 
}else{
  var channel = data.channel.id;
  var message = data.message.text;
  var token_id= data.token;
  var trigger_id = data.trigger_id;
  var callback_id = "call_id_123";
  var dialogValue={
    "trigger_id": trigger_id,
    "view": {
      "type": "modal",
      "callback_id": callback_id,
      "title": {
        "type": "plain_text",
        "text": "Save Feedback"
      },
      "submit": {
          "type": "plain_text",
          "text": "Save"
      },
      "blocks": [
        {
          "type": "input",
          "block_id": "title_id",
          "label": {
            "type": "plain_text",
            "text": "Title"
          },
          "element": {
            "type": "plain_text_input",
            "action_id": "title-value"
          },
        },
        {
          "type": "input",
          "block_id": "desc_id",
          "label": {
            "type": "plain_text",
            "text": "Description"
          },
          "element": {
            "type": "plain_text_input",
            "multiline": true,
            "action_id": "desc_value",
            "initial_value": message
          }
        }
      ]
    }
  }
  const headers_value = {
'Content-type': 'application/json',
'Authorization': 'Bearer xoxp-948251840291-959719953952-947833017538-7a3d0397a2c50db2448c00c1f45bc70a'
  }
var postingDialog = await axios.post("https://slack.com/api/views.open",dialogValue,{headers:headers_value});
console.log(postingDialog.data.response_metadata);
//console.log(headers_value);
}});


app.listen(app.get('port'), ()=> {
  console.log('Server is running at',app.get('port'));
});


var finalMessage=async (channel_id,title,message)=>{
var completionBlock= {
  "channel":channel_id,
	"blocks": [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Create Feedback*"
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": title
			},
			"accessory": {
				"type": "button",
				"text": {
					"type": "plain_text",
					"text": "Edit"
				},
				"value": "click_me_123",
				"action_id": "editButton"
			}
		},
		{
			"type": "section",
			"text": {
				"type": "plain_text",
				"text": message,
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Feedback Channel*"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 1",
							"emoji": true
						},
						"value": "value-0"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 2",
							"emoji": true
						},
						"value": "value-1"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Choice 3",
							"emoji": true
						},
						"value": "value-2"
					}
				]
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "*Privacy*"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select an item",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "Private",
							"emoji": true
						},
						"value": "true"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "Public",
							"emoji": true
						},
						"value": "false"
					}
				]
			}
		},
		{
			"type": "divider"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Create",
						"emoji": true
					},
					"style": "primary",
					"value": "click_me_123",
					"action_id": "CreateButton"
				},
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Cancel",
						"emoji": true
					},
					"value": "click_me_123"
				}
			]
		}
	]
};
var headers = {
  'Authorization': 'Bearer xoxp-948251840291-959719953952-947833017538-7a3d0397a2c50db2448c00c1f45bc70a',
   "Content-Type" : "application/json"
}
var finalPost = await axios.post("https://slack.com/api/chat.postMessage",completionBlock,{headers:headers});
 console.log(finalPost)
}