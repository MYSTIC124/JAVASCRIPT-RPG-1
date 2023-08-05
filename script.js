let xp = 0;
let health = 100;
let gold = 20;
let currentWeapon = 0;
let fighting;
let monterHealth;
let inventory = ["Graveto"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
	{
		name: "Graveto ",
		power: 6
	},
	{
		name: "Adaga ",
		power: 30
	},
	{
		name: "Martelo de ferro ",
		power: 50
	},
	{
		name: "Espada real ",
		power: 100
	}
];

const monsters = [
  {
    name: "Slime",
    level: 4,
    health: 20
  },
  {
    name: "Bokoblin",
    level: 10,
    health: 100
  },
  {
    name: "Beholder",
    level: 30,
    health: 1500
  }
];

const locations = [
    {
        name: "town square",
        "button text": ["Ir para loja", "Ir para dunas", "Enfrentar criatura"],
        "button functions": [goStore, goCave, fightDragon],
        text: "Voce esta no centro da cidade. E ve uma placa que diz \"Mercearia e Forja.\""
    },
	{
		name: "store",
		"button text": ["comprar maçã (15 geo)", "comprar armas (50 gold)", "ir de volta para o centro"],
		"button functions": [buyHealth, buyWeapon, goTown],
		text: "Você entra na loja."
	},
	{
		name: "cave",
		"button text": ["Enfrentar slime", "Enfrentar Bokoblin", "Voltar pro centro"],
    //Bokoblin é um monstrinho do zelda achei legal colocar uma referencia dele aqui
		"button functions": [fightSlime, fightBeast, goTown],
		text: "Você entra nas dunas e vê criaturas que nem o diabo se sentia bem com a presença"
	},
	{
		name: "fight",
		"button text": ["Atacar", "Esquivar", "Fugir"],
		"button functions": [attack, dodge, goTown],
		text: "Você esta enfrentando uma criatura."
	},
	{
		name: "kill monster",
		"button text": ["Continuar nas dunas", "Ir para a loja", "Ir para o centro", "Continuar nas dunas"],
		"button functions": [goCave, goStore, easterEgg],
		text: 'A criatura grita de dor e logo em seguida morre em agonia.'
	},
	{
		name: "lose",
		"button text": ["De novo?", "Mais uma vez?", "Tenha determinação."],
		"button functions": [restart, restart, restart],
		text: "voce pode se enganar que é um heroi o quanto quiser, mas nao pode enganar a morte. ☠️"
    // voce nao ta morto, so ta tendo um sonho idiota.
	},
	{
		name: "win",
		"button text": ["De novo?", "Mais uma vez?", "Tenha determinação."],
		"button functions": [restart, restart, restart],
		text: "Você derrotou a criatura! Será esse o fim?"
    //provavelmente sim.
    },
	{
		name: "easter egg",
		"button text": ["2", "8", "Voltar para o centro"],
		"button functions": [pickTwo, pickEight, goTown],
		text: "Você econtrou um Kurok e ele te pede pra escolher um numero aleatorio entre 0 e 10. Se voce acertar o numero que ele esta pensando, voce ganha!"
	}
]


// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button3.onclick = location["button functions"][2];
    text.innerText = location.text;    
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 15) {
        gold -= 15;
        health += 10;
        goldText.innerText = gold;
    	healthText.innerText = health;       
    } else {
        text.innerText = "Voce nao tem geo suficiente pra comprar maçã.";
    }

}

function buyWeapon() {
    if (currentWeapon < weapons.length - 1) {
    	if (gold >= 50) {
            gold -= 50;
            currentWeapon++;
            goldText.innerText = gold;
            let newWeapon = weapons[currentWeapon].name;
    		text.innerText = "Agora você possui " + newWeapon + ".";
            inventory.push(newWeapon);
            text.innerText += " Você possui em seu inventario : " + inventory;
    	} else {
    		text.innerText = "Você não tem Geo suficiente pra comprar uma arma.";
    	} 
    } else {
		text.innerText = "Você já tem a arma mais forte.!";
        button2.innerText = "Venda sua arma por 15 geo";
		button2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerText = gold;
        let currentWeapon = inventory.shift();
        text.innerText = "Você vendeu " + currentWeapon + ".";
        text.innerText += " Você tem em seu inventario: " + inventory;
	} else {
    	text.innerText = "Não venda sua unica arma!";
  	}
}

function fightSlime() {
	fighting = 0;
	goFight();
}

function fightBeast() {
	fighting = 1;
	goFight();    
}

function fightDragon() {
	fighting = 2;
	goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = "O " + monsters[fighting].name + " ataca.";
    text.innerText += " Você ataca com " + weapons[currentWeapon].name + ".";
    
    if (isMonsterHit()) {
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else {
		text.innerText += " Você erra.";
	}
    
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;   
	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster();
	}

	if (Math.random() <= .1 && inventory.length !== 1) {
        text.innerText += " Sua " + inventory.pop() + " quebra.";
        currentWeapon--;
	}
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - (Math.floor(Math.random() * xp));
    console.log(hit);
    return hit;
}

function isMonsterHit() {
	return Math.random() > .2 || health < 20;
}


function dodge() {
    text.innerText = "Você se esquiva do ataque do " + monsters[fighting].name + ".";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7)
    xp += monsters[fighting].level;
    goldText.innerText = gold;
	xpText.innerText = xp;
    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
	xp = 0;
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ["Graveto"];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}

function easterEgg() {
	update(locations[7]);
}

function pickTwo() {
 pick(2);
}

function pickEight() {
 pick(8);
}

function pick(guess) {
    let numbers = [];
    while (numbers.length < 10) {
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "Você escolheu " + guess + ". Aqui esta os numeros:\n";

    for (let i = 0; i < 10; i++) {
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1) {
        text.innerText += "Acertou! Ganho 20 geo!"
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Errouuu! E você perde 10 de vida!"
        health -= 10;
        healthText.innerText = health
        if (health <= 0) {
          lose();
        }
    }
}