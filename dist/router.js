'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _utils = require('./utils');

var _reports = require('./modules/reports');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express2.default.Router();

router.post('/slack/command/hello', async (req, res) => {
  try {
    const slackReqObj = req.body;
    const response = {
      response_type: 'in_channel',
      channel: slackReqObj.channel_id,
      text: 'Hello :slightly_smiling_face:',
      attachments: [{
        text: 'What report would you like to get?',
        fallback: 'What report would you like to get?',
        color: '#2c963f',
        attachment_type: 'default',
        callback_id: 'report_selection',
        actions: [{
          name: 'reports_select_menu',
          text: 'Choose a report...',
          type: 'select',
          options: _reports.reportsList
        }]
      }]
    };
    return res.json(response);
  } catch (err) {
    _utils.log.error(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});

router.post('/slack/actions', async (req, res) => {
  try {
    const slackReqObj = JSON.parse(req.body.payload);
    let response;
    if (slackReqObj.callback_id === 'report_selection') {
      response = await (0, _reports.generateReport)({ slackReqObj });
    }
    return res.json(response);
  } catch (err) {
    _utils.log.error(err);
    return res.status(500).send('Something blew up. We\'re looking into it.');
  }
});

exports.default = router;