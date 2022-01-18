import React, { useEffect, useState, useRef} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//create initial deck
const initialDeck = () => {
    const suits = ['♥', '♠', '♣', '♦'];
    const values = [...(new Array(9).fill(null)).map((_, i) => i + 2),'A','J','Q','K'];
    let deck = suits.reduce((deckAccum, suit) => {
        const allOfSuit = values.map((val) => {
            let point;
            if(val === 'A'){
                point = [1,11];
            }else if(val === 'J' || val === 'Q' || val === 'K'){
                point = 10;
            }else{
                point = val;
            }
            return {val, suit, point};
        });
        return [...deckAccum, ...allOfSuit];
    }, []);
    //shuffle cards
    for(let i = 0; i < deck.length; i++) {
        const j = Math.floor(Math.random() * deck.length)
        const tmp = deck[i]; 
        deck[i] = deck[j];
        deck[j] = tmp;
    }
    return deck;
}
//initialScore
const initialScore = (hands) => {
    return hands.reduce((score, hand) => {
        if(hand.val === 'A'){
            if(score + 11 < 21){
                return score + 11;
            }else{
                return score + 1;
            }
        }else{
            return score + hand.point;
        }
    },0)
}

//initialize game
const deck = initialDeck();
const computerHand = [];
const playerHand = [];
computerHand.push(deck.shift())
playerHand.push(deck.shift())
computerHand.push(deck.shift())
playerHand.push(deck.shift())
const computerScore = initialScore(computerHand);
const playerScore = initialScore(playerHand);

function Game(props){
    //states
    const [ch, setCh] = useState(computerHand);
    const [ph, setPh] = useState(playerHand);
    const [cs, setCs] = useState(computerScore);
    const [ps, setPs] = useState(playerScore);
    const [winner, setWinner] = useState("");
    
    //help functions
    const addScore = (score, hand) => {
        if(hand.val === 'A'){
            if(score + 11 > 21){
                return score + 1;
            }else{
                return score + 11;
            }
        }else{
            return score + hand.point;
        }
    }
    
    //event handler
    const handleHit = () => {
        const newCard = deck.shift();
        setPh([...ph, newCard]);
        setPs(ps => addScore(ps, newCard));
        if(addScore(ps, newCard) > 21){
            setWinner("Computer");
        }
        if(addScore(ps, newCard) === 21){
            setWinner("Player");
        }
    }
    const handleStand = (evt) => {
        //computer rounds
        let currentScore = cs;
        const newHits = [];
        while(currentScore <= 17){
            const newCard = deck.shift();
            newHits.push(newCard);
            currentScore = addScore(currentScore, newCard);
        }
        //computer rounds end(either lose or stand)
        let tmp;
        if(currentScore > 21){
            tmp = "Player";
        }else if(currentScore === 21){
            tmp = "Computer"
        }else{
            tmp = currentScore > ps ? "Computer" : "Player";
        }
        setCs(currentScore);
        setCh([...ch,...newHits]);
        setWinner(tmp);
    }
    
    if(winner){
        return(
            <div>
                <Score identity="Computer" score={cs} />
                <Hand hand={ch} />
                <Score identity="Player" score={ps} />
                <Hand hand={ph} />
                <Result winner={winner} /> 
            </div>
        )
    }else{
        return(
            <div>
                <Score identity="Computer" score={cs} />
                <Hand hand={ch} />
                <Score identity="Player" score={ps} />
                <Hand hand={ph} />
                <Btn handler={handleHit} value="Hit!" />
                <Btn handler={handleStand} value="Stand.." />
            </div>
        )
    }
}

function Score(props){
    return(<div>{props.identity}'s score: {props.score}</div>);
}

function Hand(props){
    const display = props.hand.map((card,i) => {
       return(<Card val={card.val} suit={card.suit} point={card.point} key={i} />)
    });

    return(
        <div className='Hand'>
            {display}
        </div>
    );
}

function Card(props){
    return(
        <div className='Card'>
            {props.suit}{props.val}
        </div>
    )
}

function Btn(props){
    return(<button className="options" onClick={props.handler}>{props.value}</button>)
}

function Result(props){
    return(<h2>{props.winner}</h2>)
}


ReactDOM.render(
    <Game />,
    document.body
)