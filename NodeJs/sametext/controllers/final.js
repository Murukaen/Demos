'use strict';

/** GET final page. */
function final(req, res) {
    /** If there is no session data redirect to index */
    if (!req.session || !req.session.data || !req.session.data.internalUserId) {
        return res.redirect(303, 'index');
    }
    let sessionData = req.session.data;
    /** Check session variables for the last authentication result and display them. */
    var loggedIn = (req.session && req.session.data.typingResult === 1);
    var lastResult = req.session.data.lastResult;
    var patternCount = sessionData.patternCount || 0;
    var device = sessionData.device || 'desktop';
    var resultColour = '#f8cd00';

    var confidence;
        
    if (lastResult !== undefined) {
        confidence = "Low";
        if (lastResult.confidence >= global.config.options.highConfidence) {
            confidence = 'High';
        }
        else if (lastResult.confidence >= global.config.options.mediumConfidence) {
            confidence = 'Medium';
        }
    }

    var showEnroll = lastResult && lastResult.score && loggedIn && lastResult.score >= global.config.options.autoEnrollThreshold;

    if (showEnroll) {
        patternCount += 1;
    }

    res.render('final', {
        title: 'Final - TypingDNA',
        sid: req.sessionID,
        loggedIn: loggedIn,
        lastResult: lastResult,
        patternCount: patternCount,
        device: device,
        resultColour: resultColour,
        showEnroll: showEnroll,
        confidence: confidence
    });
    req.session.data = {};
}

module.exports = final;
