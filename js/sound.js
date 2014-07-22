$(document).ready(function(){

	var context = new webkitAudioContext();

	var playNote = function(target){ //target later mapped to this
	var osc1 = context.createOscillator(),
		osc2 = context.createOscillator(),
		osc3 = context.createOscillator(),

		gain1 = context.createGain();
		gain2 = context.createGain();
		gain3 = context.createGain();

		lfo = context.createOscillator(),
		lfoAmp = context.createGain();
		gainNode = context.createGain();
		mGain = context.createGain();
		
		baseFrequency = notes[target.data("note")];

		osc1.type = osc1Wave;
		osc2.type = osc2Wave;
		osc3.type = osc3Wave;
		lfo.type = lfoWave;
	
		if(osc1OctUD == 1){
			osc1.frequency.value = (baseFrequency*osc1Oct)+osc1Detune;
		}else{
			osc1.frequency.value = (baseFrequency/osc1Oct)+osc1Detune;
		}
		
		if(osc2OctUD == 1){
			osc2.frequency.value = (baseFrequency*osc2Oct)+osc2Detune;
		}else{
			osc2.frequency.value = (baseFrequency/osc2Oct)+osc2Detune;
		}

		if(osc3OctUD == 1){
			osc3.frequency.value = (baseFrequency*osc3Oct)+osc3Detune;
		}else{
			osc3.frequency.value = (baseFrequency/osc3Oct)+osc3Detune;
		}
		
		
		lfo.frequency.value = lfoSpeed;

		gain1.gain.value = osc1Gain;
		gain2.gain.value = osc2Gain;
		gain3.gain.value = osc3Gain;

		mGain.gain.value = masterGain;

		lfoAmp.gain.value = lfoStrength; //strength of lfo

		lfo.connect(lfoAmp);
		lfoAmp.connect(osc1.frequency);
		lfoAmp.connect(osc2.frequency);
		lfoAmp.connect(osc3.frequency);

		//route osc individual gains, to master gain node, to speakers.
		osc1.connect(gain1);
		osc2.connect(gain2);
		osc3.connect(gain3);
		gain1.connect(gainNode);
		gain2.connect(gainNode);
		gain3.connect(gainNode);
		gainNode.connect(mGain);
		mGain.connect(context.destination);

		osc1.noteOn(0);
		osc2.noteOn(0);
		osc3.noteOn(0);
		lfo.noteOn(0);
		currentOscillator1 = osc1;
		currentOscillator2 = osc2;
		currentOscillator3 = osc3;
		currentLfo = lfo;

		now = context.currentTime;
		gainNode.gain.cancelScheduledValues(now);
		gainNode.gain.setValueAtTime(0, now);
		gainNode.gain.linearRampToValueAtTime(0.6, now + attackTime);

		currentGain = gainNode;
		currentmGain = mGain;
		};

	var stopNote = function (){
		now = context.currentTime;
		currentGain.gain.linearRampToValueAtTime(0, now + attackTime + releaseTime);
		currentOscillator1.noteOff(now + attackTime + releaseTime +1); //stops osc after 0 seconds
		currentOscillator2.noteOff(now + attackTime + releaseTime +1); //stops osc after 0 seconds
		currentOscillator3.noteOff(now + attackTime + releaseTime +1); //stops osc after 0 seconds
		currentLfo.noteOff(now + attackTime + releaseTime +1); //stops lfo after 0 seconds
		//currentOscillator1.disconnect(0);
		//currentOscillator2.disconnect(0);
		//currentOscillator3.disconnect(0);
		//currentLfo.disconnect(0);
	}

	$(".trigger").mouseenter(function(){
		playNote($(this));//grabs note data from trigger
	});

	$(".trigger").mouseleave(function(){
		stopNote();
	});

	$(function() {
        $(".dial").knob({
        	'min':0,
        	'max':11,
        	'width':100,
        	'displayPrevious':true,
        	'font': 'Montserrat',
        	'fontWeight': 400,
        	'fgColor':"#F5E5C0",
        	'bgColor':"#231F20",
        	'change': function(value){
				masterGain = value/10;
				console.log("Master Gain : " + masterGain);
			}
        });
    });

});