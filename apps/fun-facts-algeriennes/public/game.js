/* =====================================================================
   FUN FACTS ALGERIENNES — moteur du mini-jeu
   Case du "Bingo Eticien" | Club ETIC, ESI Alger
   JavaScript vanilla, aucune dependance.
   Chaque ligne est commentee, comme demande dans le brief.
   ===================================================================== */


/* =====================================================================
   SECTION 1 — MIROIR DE SECOURS DE LA BANQUE

   La source de verite reste questions.json : c'est ce fichier que le
   jeu charge des qu'il tourne derriere un serveur (http:// ou file
   servi). Mais un navigateur refuse un fetch() vers un fichier local
   quand la page est ouverte en double-clic (protocole file://, regle
   CORS). Or le brief exige que index.html soit jouable en double-clic.
   D'ou ce miroir de secours, utilise UNIQUEMENT si le fetch echoue.

   >>> SI TU MODIFIES questions.json, RECOPIE LE TABLEAU ICI. <<<
   (Ou sers le dossier avec `python -m http.server` : dans ce cas le
   fetch reussit et ce miroir n'est jamais lu.)
   ===================================================================== */
var QUESTIONS_MIROIR = {
  gameId: "fun-facts-dz",
  meta: {
    timePerQuestion: 8,
    passThreshold: 6,
    pointsPerCorrect: 100,
    speedBonusPerSecond: 5,
    questionsPerGame: 10,
    insiderPerGame: 2
  },
  questions: [
    {
      id: "dz01",
      statement: "Le Sahara couvre plus de 80 % du territoire algérien.",
      isTrue: true,
      explanation: "Vrai : le désert occupe environ 84 % de la superficie du pays.",
      category: "géographie"
    },
    {
      id: "dz03",
      statement: "L'Algérie possède un accès à l'océan Atlantique.",
      isTrue: false,
      explanation: "Faux : sa seule façade maritime est méditerranéenne.",
      category: "géographie"
    },
    {
      id: "dz02",
      statement: "L'Algérie est le plus grand pays d'Afrique par la superficie.",
      isTrue: true,
      explanation: "Vrai, depuis 2011 et la partition du Soudan : environ 2 381 741 km².",
      category: "géographie"
    },
    {
      id: "dz04",
      statement: "L'Algérie partage une frontière terrestre avec l'Égypte.",
      isTrue: false,
      explanation: "Faux : la Libye s'intercale entre les deux pays.",
      category: "géographie"
    },
    {
      id: "dz05",
      statement: "L'Algérie partage une frontière terrestre avec le Mali.",
      isTrue: true,
      explanation: "Vrai : la frontière saharienne algéro-malienne dépasse 1 300 km.",
      category: "géographie"
    },
    {
      id: "dz06",
      statement: "Le point culminant de l'Algérie se trouve dans les montagnes de Kabylie.",
      isTrue: false,
      explanation: "Faux : c'est le mont Tahat, 2 908 m, dans le Hoggar, en plein Sahara.",
      category: "géographie"
    },
    {
      id: "dz08",
      statement: "Le Chott Melrhir est un lac salé situé sous le niveau de la mer.",
      isTrue: true,
      explanation: "Vrai : cette dépression descend à une quarantaine de mètres sous le niveau marin.",
      category: "géographie"
    },
    {
      id: "dz07",
      statement: "Le Grand Erg Oriental est une chaîne de montagnes du nord du pays.",
      isTrue: false,
      explanation: "Faux : c'est une immense mer de dunes, au Sahara.",
      category: "géographie"
    },
    {
      id: "dz14",
      statement: "L'Algérie possède une façade méditerranéenne de plus de 900 km.",
      isTrue: true,
      explanation: "Vrai : le littoral algérien s'étend sur près de mille kilomètres.",
      category: "géographie"
    },
    {
      id: "dz09",
      statement: "Le fleuve le plus long d'Algérie est la Soummam.",
      isTrue: false,
      explanation: "Faux : c'est le Chéliff, environ 700 km, de l'Atlas saharien à la Méditerranée.",
      category: "géographie"
    },
    {
      id: "dz15",
      statement: "Le massif du Hoggar est d'origine volcanique.",
      isTrue: true,
      explanation: "Vrai : ses pitons caractéristiques sont d'anciens culots volcaniques.",
      category: "géographie"
    },
    {
      id: "dz10",
      statement: "L'Algérie compte encore 48 wilayas, comme dans les années 1980.",
      isTrue: false,
      explanation: "Faux : le découpage de 2021 a porté le pays à 58 wilayas.",
      category: "géographie"
    },
    {
      id: "dz16",
      statement: "L'Algérie a obtenu son indépendance le 5 juillet 1962.",
      isTrue: true,
      explanation: "Vrai : le 5 juillet est depuis la fête nationale.",
      category: "histoire"
    },
    {
      id: "dz11",
      statement: "La ville de Béchar se situe dans le nord-est du pays.",
      isTrue: false,
      explanation: "Faux : Béchar est une ville du sud-ouest algérien.",
      category: "géographie"
    },
    {
      id: "dz18",
      statement: "Djamila Bouhired est une figure de la guerre d'indépendance.",
      isTrue: true,
      explanation: "Vrai : militante du FLN, condamnée à mort en 1957 puis graciée.",
      category: "histoire"
    },
    {
      id: "dz12",
      statement: "Oran est située sur la côte est de l'Algérie.",
      isTrue: false,
      explanation: "Faux : Oran est le grand port de l'ouest algérien.",
      category: "géographie"
    },
    {
      id: "dz20",
      statement: "Annaba portait le nom d'Hippone dans l'Antiquité.",
      isTrue: true,
      explanation: "Vrai : Hippo Regius, l'un des grands ports romains d'Afrique du Nord.",
      category: "histoire"
    },
    {
      id: "dz13",
      statement: "Le Sahara algérien ne connaît jamais la neige.",
      isTrue: false,
      explanation: "Faux : Aïn Séfra, aux portes du Sahara, a été enneigée à plusieurs reprises ces dernières années.",
      category: "géographie"
    },
    {
      id: "dz22",
      statement: "Les peintures rupestres du Tassili n'Ajjer ont plus de 9 000 ans.",
      isTrue: true,
      explanation: "Vrai : ce site UNESCO conserve des milliers de peintures, dont les plus anciennes dépassent 9 000 ans.",
      category: "histoire"
    },
    {
      id: "dz17",
      statement: "La bataille d'Alger s'est déroulée en 1961-1962.",
      isTrue: false,
      explanation: "Faux : elle a eu lieu en 1956-1957, dans la Casbah.",
      category: "histoire"
    },
    {
      id: "dz23",
      statement: "Béjaïa a donné son nom au mot français « bougie ».",
      isTrue: true,
      explanation: "Vrai : la ville, appelée Bougie, exportait la cire vers l'Europe médiévale.",
      category: "histoire"
    },
    {
      id: "dz19",
      statement: "Timgad, surnommée « la Pompéi africaine », est une cité grecque des Aurès.",
      isTrue: false,
      explanation: "Faux : c'est une cité romaine, fondée vers 100 apr. J.-C. sous Trajan.",
      category: "histoire"
    },
    {
      id: "dz24",
      statement: "« El Djazaïr », le nom arabe de l'Algérie, signifie « les îles ».",
      isTrue: true,
      explanation: "Vrai : en référence aux îlots qui faisaient face au port d'Alger.",
      category: "histoire"
    },
    {
      id: "dz21",
      statement: "Saint Augustin a été évêque de Tlemcen.",
      isTrue: false,
      explanation: "Faux : il fut évêque d'Hippone, l'actuelle Annaba, de 395 à 430.",
      category: "histoire"
    },
    {
      id: "etic01",
      statement: "[À REMPLACER PAR GHANO — anecdote ETIC : affirmation vraie ou fausse sur le club]",
      isTrue: true,
      explanation: "[À REMPLACER PAR GHANO — explication courte de l'anecdote]",
      category: "etic-insider"
    },
    {
      id: "etic02",
      statement: "[À REMPLACER PAR GHANO — running gag du Training Camp]",
      isTrue: false,
      explanation: "[À REMPLACER PAR GHANO — explication courte de l'anecdote]",
      category: "etic-insider"
    }
  ]
};


/* =====================================================================
   SECTION 1 bis — REGLAGES DE LA PARTIE
   Valeurs par defaut, toutes surchargeables par le bloc "meta" de
   questions.json : le jeu se regle sans toucher au code.
   ===================================================================== */

/* Identifiant de la case, repris tel quel dans le resultat publie. */
var GAME_ID = "fun-facts-dz";

/* Secondes accordees pour repondre a une question. */
var TEMPS_PAR_QUESTION = 8;

/* Nombre de bonnes reponses necessaires pour valider la case du bingo. */
var SEUIL_VALIDATION = 6;

/* Points fixes accordes par bonne reponse. */
var POINTS_PAR_BONNE = 100;

/* Points de bonus par seconde restante sur une bonne reponse. */
var BONUS_PAR_SECONDE = 5;

/* Nombre de questions posees par partie, tirees dans la banque.
   Surchargeable par meta.questionsPerGame dans questions.json. */
var QUESTIONS_PAR_PARTIE = 10;

/* Nombre de questions "etic-insider" que le tirage essaie de placer.
   Surchargeable par meta.insiderPerGame. */
var INSIDERS_PAR_PARTIE = 2;

/* Seuil d'entree dans l'etat "alerte" du chrono, en secondes restantes. */
var SEUIL_ALERTE = 4;

/* Seuil d'entree dans l'etat "critique" du chrono, en secondes restantes. */
var SEUIL_CRITIQUE = 2;

/* Delai d'affichage du feedback avant d'enchainer, en millisecondes. */
var DELAI_ENCHAINEMENT = 2600;


/* =====================================================================
   SECTION 2 — REFERENCES AUX ELEMENTS DU DOM
   Recuperees une seule fois au chargement, pour eviter de requeter
   le DOM a chaque image d'animation.
   ===================================================================== */

/* Petit raccourci de selection par identifiant. */
function $(id) {
  /* document.getElementById est la methode la plus rapide du DOM. */
  return document.getElementById(id);
}

/* Les trois ecrans du jeu. */
var ecranAccueil = $("screen-start");
var ecranQuiz = $("screen-quiz");
var ecranResultat = $("screen-result");

/* Boutons de navigation. */
var boutonDemarrer = $("btn-start");
var boutonRejouer = $("btn-replay");

/* Elements du HUD. */
var listePips = $("pips");
var blocChrono = $("timer");
var anneauChrono = $("timer-ring");
var valeurChrono = $("timer-value");
var scoreLive = $("score-live");

/* Piste des cartes et template de carte. */
var piste = $("stage");
var templateQuestion = $("tpl-question");

/* Boutons de reponse. */
var zoneReponses = $("answers");
var boutonVrai = $("btn-true");
var boutonFaux = $("btn-false");

/* Region vocale pour les lecteurs d'ecran. */
var regionVocale = $("quiz-live");

/* Couche decorative de fond (rubans de la charte, VI p.21). */
var decor = $("backdrop");

/* Elements de l'ecran de resultat. */
var gerbeRubans = $("cheer");
var blocVerdict = $("verdict");
var iconeVerdict = $("verdict-icon");
var texteVerdict = $("verdict-text");
var compteurScore = $("odometer");
var detailBonnes = $("bd-correct");
var detailBase = $("bd-base");
var detailBonus = $("bd-bonus");
var remplissageSeuil = $("threshold-fill");


/* =====================================================================
   SECTION 3 — ETAT DE LA PARTIE
   Un seul objet regroupe tout l'etat mutable : plus facile a suivre,
   et remis a zero d'un coup au moment de rejouer.
   ===================================================================== */

/* Banque complete, telle que lue dans questions.json. On n'y touche plus
   une fois chargee : chaque partie y pioche, elle ne la consomme pas. */
var banqueQuestions = [];

/* Les QUESTIONS_PAR_PARTIE questions effectivement posees cette partie. */
var questions = [];

/* Objet d'etat de la partie en cours. */
var etat = {
  index: 0,          /* indice de la question courante, base 0 */
  bonnes: 0,         /* nombre de bonnes reponses */
  pointsBase: 0,     /* total des points de reponses (bonnes x 100) */
  pointsBonus: 0,    /* total des bonus de vitesse */
  verrouille: true,  /* true quand les boutons ne doivent pas repondre */
  debutQuestion: 0,  /* horodatage du debut de la question (performance.now) */
  idFrame: null,     /* identifiant du requestAnimationFrame du chrono */
  idTimeout: null,   /* identifiant du setTimeout d'enchainement */
  carteCourante: null /* reference vers l'element .qcard affiche */
};


/* =====================================================================
   SECTION 4 — CHARGEMENT ET TIRAGE DES QUESTIONS
   ===================================================================== */

/* Applique le bloc "meta" du JSON aux constantes de reglage. */
function appliquerMeta(meta) {
  /* Si aucun bloc meta n'est fourni, on garde les valeurs par defaut. */
  if (!meta) return;

  /* Chaque valeur n'est reprise que si elle est bien un nombre. */
  if (typeof meta.questionsPerGame === "number") QUESTIONS_PAR_PARTIE = meta.questionsPerGame;
  if (typeof meta.insiderPerGame === "number") INSIDERS_PAR_PARTIE = meta.insiderPerGame;
  if (typeof meta.timePerQuestion === "number") TEMPS_PAR_QUESTION = meta.timePerQuestion;
  if (typeof meta.passThreshold === "number") SEUIL_VALIDATION = meta.passThreshold;
  if (typeof meta.pointsPerCorrect === "number") POINTS_PAR_BONNE = meta.pointsPerCorrect;
  if (typeof meta.speedBonusPerSecond === "number") BONUS_PAR_SECONDE = meta.speedBonusPerSecond;
}

/* Charge questions.json, avec repli automatique sur le miroir embarque. */
function chargerQuestions() {
  /* Garde-fou : sur un navigateur trop ancien, fetch n'existe pas.
     On part alors directement sur le miroir, sans lever d'erreur. */
  if (typeof fetch !== "function") {
    appliquerMeta(QUESTIONS_MIROIR.meta);
    banqueQuestions = QUESTIONS_MIROIR.questions.slice();
    questions = tirerQuestions();
    return Promise.resolve(banqueQuestions.length);
  }

  /* fetch renvoie une promesse : on chaine la lecture puis le repli. */
  return fetch("questions.json")
    .then(function (reponse) {
      /* Un 404 ne declenche pas d'erreur : il faut le tester nous-memes. */
      if (!reponse.ok) throw new Error("HTTP " + reponse.status);
      /* Conversion du corps de la reponse en objet JavaScript. */
      return reponse.json();
    })
    .catch(function (erreur) {
      /* Cas typique : page ouverte en file://, fetch bloque par CORS. */
      console.warn(
        "[fun-facts-dz] questions.json non chargeable (" + erreur.message +
        "). Utilisation du miroir embarque dans game.js."
      );
      /* On rend le miroir pour que la partie puisse demarrer quand meme. */
      return QUESTIONS_MIROIR;
    })
    .then(function (donnees) {
      /* Le bloc meta pilote duree, seuil et bareme. */
      appliquerMeta(donnees.meta);
      /* On ne garde que les entrees qui ont bien une affirmation. */
      banqueQuestions = (donnees.questions || []).filter(function (q) {
        return q && typeof q.statement === "string";
      });
      /* Premier tirage : il alimente deja les pastilles de l'accueil. */
      questions = tirerQuestions();
      /* On renvoie la taille de la banque, utile pour les logs. */
      return banqueQuestions.length;
    });
}

/* Melange un tableau (Fisher-Yates) et renvoie une copie melangee.
   On part de la fin : a chaque tour, on echange l'element courant avec
   un element tire parmi ceux qui n'ont pas encore ete places. */
function melanger(tableau) {
  /* On travaille sur une copie : la banque ne doit jamais etre reordonnee. */
  var copie = tableau.slice();

  /* Parcours de la fin vers le debut. */
  for (var i = copie.length - 1; i > 0; i--) {
    /* Indice tire au hasard entre 0 et i inclus. */
    var j = Math.floor(Math.random() * (i + 1));
    /* Echange des deux cases. */
    var tampon = copie[i];
    copie[i] = copie[j];
    copie[j] = tampon;
  }

  return copie;
}

/* Une question "insider" n'est jouable que si Ghano l'a bien remplie :
   tant que l'enonce contient encore le marqueur de remplacement, elle
   reste en reserve et n'est jamais tiree. */
function insiderJouable(question) {
  if (question.category !== "etic-insider") return false;
  return question.statement.indexOf("REMPLACER PAR GHANO") === -1;
}

/* Compose la grille d'une partie : quelques insiders si le club en a
   fourni, le reste en culture generale, le tout remelange.
   Deux joueurs cote a cote n'ont donc pas la meme serie. */
function tirerQuestions() {
  /* Banque vide : rien a tirer, on rend un tableau vide plutot qu'une erreur. */
  if (!banqueQuestions.length) return [];

  /* Separation des deux familles. */
  var insiders = banqueQuestions.filter(insiderJouable);
  var generales = banqueQuestions.filter(function (q) {
    return q.category !== "etic-insider";
  });

  /* On place d'abord les insiders, dans la limite de ce qui existe. */
  var tirage = melanger(insiders).slice(0, INSIDERS_PAR_PARTIE);

  /* Le reste de la grille est complete en culture generale. */
  var manque = QUESTIONS_PAR_PARTIE - tirage.length;
  tirage = tirage.concat(melanger(generales).slice(0, manque));

  /* Dernier melange : sinon les insiders tomberaient toujours en premier. */
  return melanger(tirage);
}


/* =====================================================================
   SECTION 5 — NAVIGATION ENTRE ECRANS
   ===================================================================== */

/* Affiche un seul ecran et masque les deux autres. */
function afficherEcran(ecranVoulu) {
  /* On parcourt les trois ecrans connus. */
  [ecranAccueil, ecranQuiz, ecranResultat].forEach(function (ecran) {
    /* La classe --active declenche l'affichage et l'animation d'entree. */
    ecran.classList.toggle("screen--active", ecran === ecranVoulu);
    /* Les ecrans caches sortent aussi de l'arbre d'accessibilite. */
    if (ecran === ecranVoulu) {
      ecran.removeAttribute("aria-hidden");
    } else {
      ecran.setAttribute("aria-hidden", "true");
    }
  });
}


/* =====================================================================
   SECTION 6 — PASTILLES DE PROGRESSION
   ===================================================================== */

/* Construit la rangee de pastilles, une par question de la partie. */
function construirePips() {
  /* On repart d'une rangee vide a chaque nouvelle partie. */
  listePips.innerHTML = "";

  /* Une pastille par question. */
  questions.forEach(function () {
    var pip = document.createElement("li");
    pip.className = "pip";
    /* La pastille est purement visuelle : on la masque aux lecteurs. */
    pip.setAttribute("aria-hidden", "true");
    listePips.appendChild(pip);
  });

  /* Mise en avant de la premiere question. */
  majPips();
}

/* Met a jour la pastille "en cours". */
function majPips() {
  var pips = listePips.children;
  for (var i = 0; i < pips.length; i++) {
    /* Seule la question courante porte la classe --current. */
    pips[i].classList.toggle("pip--current", i === etat.index);
  }
}

/* Fige la pastille de la question qui vient d'etre repondue. */
function marquerPip(estCorrect) {
  var pip = listePips.children[etat.index];
  if (!pip) return;

  /* La pastille n'est plus "en cours". */
  pip.classList.remove("pip--current");
  /* Elle prend la couleur de l'issue. */
  pip.classList.add(estCorrect ? "pip--correct" : "pip--wrong");
}


/* =====================================================================
   SECTION 7 — CHRONO CIRCULAIRE
   ===================================================================== */

/* Longueur totale de l'anneau : 2 x PI x rayon (r = 52 dans le SVG). */
var PERIMETRE_ANNEAU = 2 * Math.PI * 52;

/* Remet l'anneau a plein et efface les etats d'alerte. */
function reinitialiserChrono() {
  /* Le trace complet sert de motif de tirets... */
  anneauChrono.style.strokeDasharray = String(PERIMETRE_ANNEAU);
  /* ...et le decalage a zero signifie "anneau entier visible". */
  anneauChrono.style.strokeDashoffset = "0";

  /* Valeur numerique remise au maximum. */
  valeurChrono.textContent = String(TEMPS_PAR_QUESTION);

  /* Retrait des deux etats d'alerte. */
  blocChrono.classList.remove("is-warning", "is-critical");
}

/* Une image de chrono : recalcule le temps restant et redessine. */
function tickChrono() {
  /* Temps ecoule depuis le debut de la question, en secondes. */
  var ecoule = (performance.now() - etat.debutQuestion) / 1000;

  /* Temps restant, borne a zero. */
  var restant = Math.max(0, TEMPS_PAR_QUESTION - ecoule);

  /* Part du tour deja consommee, entre 0 et 1. */
  var part = 1 - restant / TEMPS_PAR_QUESTION;

  /* On efface la portion consommee en poussant le decalage de tirets. */
  anneauChrono.style.strokeDashoffset = String(PERIMETRE_ANNEAU * part);

  /* Le chiffre affiche est arrondi vers le haut : il tombe a 0 pile a la fin. */
  var affiche = Math.ceil(restant);
  if (valeurChrono.textContent !== String(affiche)) {
    valeurChrono.textContent = String(affiche);
  }

  /* Etat "alerte" : le temps commence a manquer. */
  blocChrono.classList.toggle("is-warning", restant <= SEUIL_ALERTE && restant > SEUIL_CRITIQUE);

  /* Etat "critique" : les deux dernieres secondes. */
  blocChrono.classList.toggle("is-critical", restant <= SEUIL_CRITIQUE && restant > 0);

  /* Temps ecoule : la question est traitee comme une non-reponse. */
  if (restant <= 0) {
    arreterChrono();
    blocChrono.classList.remove("is-critical");
    traiterReponse(null);
    return;
  }

  /* Sinon, on redemande une image. */
  etat.idFrame = requestAnimationFrame(tickChrono);
}

/* Demarre le chrono de la question courante. */
function demarrerChrono() {
  /* Horodatage de depart, utilise par chaque image et par le bonus. */
  etat.debutQuestion = performance.now();
  /* Premiere image. */
  etat.idFrame = requestAnimationFrame(tickChrono);
}

/* Arrete la boucle du chrono. */
function arreterChrono() {
  if (etat.idFrame !== null) {
    cancelAnimationFrame(etat.idFrame);
    etat.idFrame = null;
  }
  /* L'etat critique ne doit pas survivre a l'arret. */
  blocChrono.classList.remove("is-critical");
}


/* =====================================================================
   SECTION 8 — AFFICHAGE D'UNE QUESTION
   ===================================================================== */

/* --- Icone de categorie ---
   Une icone par famille de questions. Elle ne porte aucune information
   indispensable (la categorie est deja ecrite en toutes lettres dans
   l'etiquette voisine) : elle sert uniquement de repere visuel, d'ou
   l'aria-hidden sur la pastille dans le HTML. */
var ICONES_CATEGORIE = {
  "géographie": "🏜",
  "histoire": "📜",
  "villes": "🏙",
  "traditions": "🫖",
  "personnalités": "⭐",
  "sport & symboles": "⚽"
};

/* Retourne l'icone d'une categorie, avec deux reprises :
   la cible pour les anecdotes du club, le drapeau algerien sinon. */
function iconeDeCategorie(categorie) {
  if (categorie === "etic-insider") return "🎯";
  return ICONES_CATEGORIE[categorie] || "🇩🇿";
}

/* Clone le template, remplit la carte et l'injecte dans la piste. */
function afficherQuestion() {
  var question = questions[etat.index];
  if (!question) return;

  /* Clonage du template : chaque question a sa propre carte, ce qui
     permet de faire coexister la sortante et l'entrante le temps du
     croisement, et garantit une animation d'entree toujours neuve. */
  var fragment = templateQuestion.content.cloneNode(true);
  var carte = fragment.querySelector(".qcard");

  /* Numero de la question, au format "Question 3 / 10". */
  carte.querySelector(".qcard__index").textContent =
    "Question " + (etat.index + 1) + " / " + questions.length;

  /* Etiquette de categorie. */
  var etiquette = carte.querySelector(".qcard__tag");
  if (question.category === "etic-insider") {
    /* Les anecdotes du club sont signalees differemment. */
    etiquette.textContent = "Culture club ETIC";
    etiquette.classList.add("qcard__tag--insider");
  } else {
    etiquette.textContent = question.category || "culture générale";
  }

  /* Pastille d'icone : une icone par categorie, pour que la carte soit
     identifiable d'un coup d'oeil avant meme la lecture de l'enonce. */
  carte.querySelector(".qcard__emoji").textContent =
    iconeDeCategorie(question.category);

  /* L'affirmation elle-meme. */
  carte.querySelector(".qcard__statement").textContent = question.statement;

  /* Classe d'entree : la carte arrive depuis la droite. */
  carte.classList.add("qcard--enter");

  /* Injection dans la piste. */
  piste.appendChild(fragment);

  /* On garde une reference vers la carte reellement inseree. */
  etat.carteCourante = piste.querySelector(".qcard:last-child");

  /* Pastille de progression et annonce vocale. */
  majPips();
  regionVocale.textContent =
    "Question " + (etat.index + 1) + " sur " + questions.length + ". " + question.statement;

  /* Boutons rendus au joueur. */
  deverrouillerReponses();

  /* Chrono remis a plein puis lance. */
  reinitialiserChrono();
  demarrerChrono();
}

/* Rend les boutons de reponse utilisables et vierges de tout etat. */
function deverrouillerReponses() {
  [boutonVrai, boutonFaux].forEach(function (bouton) {
    bouton.disabled = false;
    /* Retrait de tous les etats de la question precedente. */
    bouton.classList.remove("is-picked", "is-correct", "is-wrong", "is-revealed");
  });
  etat.verrouille = false;
}

/* Bloque les boutons pendant l'affichage du feedback. */
function verrouillerReponses() {
  etat.verrouille = true;
  [boutonVrai, boutonFaux].forEach(function (bouton) {
    bouton.disabled = true;
  });
}


/* =====================================================================
   SECTION 9 — TRAITEMENT D'UNE REPONSE
   ===================================================================== */

/* Traite la reponse du joueur : true, false, ou null si le temps est ecoule. */
function traiterReponse(reponse) {
  /* Double securite : un clic tardif ne doit rien declencher. */
  if (etat.verrouille) return;

  /* Le chrono s'arrete des que la reponse est donnee. */
  arreterChrono();
  verrouillerReponses();

  var question = questions[etat.index];

  /* Une non-reponse est toujours fausse (regle du brief). */
  var estCorrect = reponse !== null && reponse === question.isTrue;

  /* Bonus de vitesse : calcule sur le temps restant au moment de la reponse. */
  var ecoule = (performance.now() - etat.debutQuestion) / 1000;
  var restant = Math.max(0, TEMPS_PAR_QUESTION - ecoule);
  var bonus = estCorrect ? Math.round(restant * BONUS_PAR_SECONDE) : 0;

  /* Mise a jour des compteurs de la partie. */
  if (estCorrect) {
    etat.bonnes += 1;
    etat.pointsBase += POINTS_PAR_BONNE;
    etat.pointsBonus += bonus;
  }

  /* Retours visuels : pastille, score, carte et boutons. */
  marquerPip(estCorrect);
  majScoreLive(estCorrect);
  appliquerFeedback(question, reponse, estCorrect, bonus);

  /* Enchainement automatique apres le temps de lecture du feedback. */
  etat.idTimeout = setTimeout(questionSuivante, DELAI_ENCHAINEMENT);
}

/* Met a jour la puce de score du HUD. */
function majScoreLive(aMarque) {
  /* Le score affiche est toujours le total courant. */
  scoreLive.textContent = String(etat.pointsBase + etat.pointsBonus);

  /* Le sursaut n'est demande que quand le joueur vient de marquer. */
  if (!aMarque) return;

  /* Retrait puis reajout de la classe : sans cela, l'animation ne
     repart pas quand deux bonnes reponses s'enchainent. */
  scoreLive.classList.remove("is-bumped");

  /* Lecture forcee d'une propriete de mise en page : elle oblige le
     navigateur a prendre acte du retrait avant le reajout. */
  void scoreLive.offsetWidth;

  /* Reajout : l'animation de sursaut repart du debut. */
  scoreLive.classList.add("is-bumped");
}

/* Applique les etats visuels de feedback sur la carte et les boutons. */
function appliquerFeedback(question, reponse, estCorrect, bonus) {
  /* Reference vers la carte affichee. */
  var carte = etat.carteCourante;

  /* Securite : si la carte a disparu, on n'essaie pas de la styler. */
  if (!carte) return;

  /* Libelle du verdict affiche en haut du panneau de feedback. */
  var libelle;

  /* Trois cas : bonne reponse, mauvaise reponse, temps ecoule. */
  if (estCorrect) {
    /* On mentionne le bonus gagne, c'est ce qui rend la vitesse lisible. */
    libelle = "Correct — +" + (POINTS_PAR_BONNE + bonus) + " pts";
  } else if (reponse === null) {
    /* Aucune reponse donnee dans les temps. */
    libelle = "Temps écoulé";
  } else {
    /* Reponse donnee mais fausse. */
    libelle = "Raté";
  }

  /* Ecriture du verdict dans la carte. */
  carte.querySelector(".qcard__verdict").textContent = libelle;

  /* Ecriture de l'explication courte fournie par le JSON. */
  carte.querySelector(".qcard__explanation").textContent = question.explanation || "";

  /* Classe qui deploie le panneau de feedback. */
  carte.classList.add("is-answered");

  /* Classe d'issue : pilote la bordure, le fond et l'animation de la carte. */
  carte.classList.add(estCorrect ? "is-correct" : "is-wrong");

  /* Bouton correspondant au choix du joueur, s'il en a fait un. */
  var boutonChoisi = reponse === true ? boutonVrai : (reponse === false ? boutonFaux : null);

  /* Bouton portant la bonne reponse. */
  var boutonAttendu = question.isTrue ? boutonVrai : boutonFaux;

  /* Mise en avant du choix du joueur. */
  if (boutonChoisi) {
    /* Le bouton choisi reste pleinement visible malgre le verrouillage. */
    boutonChoisi.classList.add("is-picked");
    /* Puis il se remplit en couleur d'issue. */
    boutonChoisi.classList.add(estCorrect ? "is-correct" : "is-wrong");
  }

  /* Si le joueur s'est trompe ou n'a pas repondu, on revele la bonne case. */
  if (!estCorrect) {
    boutonAttendu.classList.add("is-revealed");
  }

  /* Le decor de fond repond a l'issue : rubans froids si c'est bon,
     rubans chauds si c'est rate (voir section 10 bis). */
  pulserDecor(estCorrect ? "correct" : "wrong");

  /* Annonce vocale du resultat, a la suite de la question. */
  regionVocale.textContent = libelle + ". " + (question.explanation || "");
}


/* =====================================================================
   SECTION 10 bis — DECOR ANIME
   Tout ce qui fait reagir les assets de la charte (rubans de la planche
   VI p.21, carres de valeurs du logo VI p.6) au deroule de la partie.
   Aucune de ces fonctions n'est indispensable au jeu : si la couche
   decorative manque dans le HTML, elles ne font simplement rien.
   ===================================================================== */

/* Liste des rubans disponibles, par famille de couleur.
   Ce sont les fichiers reellement exportes du Figma de la VI. */
var RUBANS = {
  /* Type 1 de la planche : rouge / orange / jaune. */
  warm: ["ribbon-warm-1", "ribbon-warm-2", "ribbon-warm-3", "ribbon-warm-4"],
  /* Type 2 de la planche : teal / cyan / vert. */
  cool: ["ribbon-cool-1", "ribbon-cool-2", "ribbon-cool-3", "ribbon-cool-4"]
};

/* Identifiant du minuteur qui retire l'etat de pulsation du decor. */
var idPulsationDecor = null;

/* Vrai si le systeme demande a limiter les animations. */
function mouvementReduit() {
  /* matchMedia peut manquer sur de tres vieux navigateurs : on suppose
     alors que les animations sont les bienvenues. */
  if (!window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Fait reagir le decor de fond a l'issue d'une question.
   "correct" reveille les rubans froids, "wrong" crispe les rubans chauds. */
function pulserDecor(issue) {
  /* Sans couche decorative, il n'y a rien a animer. */
  if (!decor) return;

  /* Si le joueur a demande moins de mouvement, on ne pulse pas du tout. */
  if (mouvementReduit()) return;

  /* On annule la pulsation precedente, sinon deux reponses rapprochees
     se marcheraient dessus. */
  if (idPulsationDecor !== null) clearTimeout(idPulsationDecor);

  /* Retrait immediat de l'attribut : l'animation CSS doit pouvoir
     repartir de zero meme si l'issue est la meme qu'a la question d'avant. */
  decor.removeAttribute("data-pulse");

  /* Lecture forcee d'une propriete de mise en page : elle oblige le
     navigateur a prendre acte du retrait avant de remettre l'attribut. */
  void decor.offsetWidth;

  /* Pose de l'etat : le CSS fait le reste. */
  decor.setAttribute("data-pulse", issue);

  /* Nettoyage une fois l'animation terminee (0,42 s cote CSS, marge incluse). */
  idPulsationDecor = setTimeout(function () {
    decor.removeAttribute("data-pulse");
    idPulsationDecor = null;
  }, 600);
}

/* Vide la gerbe de rubans de l'ecran de resultat. */
function viderGerbe() {
  /* Rien a faire si la couche n'existe pas. */
  if (!gerbeRubans) return;
  gerbeRubans.innerHTML = "";
}

/* Depose quelques rubans de la charte au-dessus de la carte de resultat.
   Froids si la case est validee, chauds sinon. */
function lancerGerbe(validee) {
  /* Sans couche de gerbe, on sort sans rien casser. */
  if (!gerbeRubans) return;

  /* On repart toujours d'une couche vide (cas du "Rejouer"). */
  viderGerbe();

  /* Mouvement reduit : la gerbe est purement decorative, on la saute. */
  if (mouvementReduit()) return;

  /* Famille de rubans correspondant a l'issue de la partie. */
  var famille = RUBANS[validee ? "cool" : "warm"];

  /* Positions d'arrivee, en pourcentage de la carte. Elles sont fixes
     plutot qu'aleatoires : la composition reste maitrisee a chaque partie. */
  var places = [
    { x: "12%", y: "18%", w: "78px", r: "-24deg", delay: "0.15s" },
    { x: "88%", y: "26%", w: "64px", r: "38deg", delay: "0.28s" },
    { x: "18%", y: "76%", w: "58px", r: "126deg", delay: "0.41s" },
    { x: "84%", y: "72%", w: "70px", r: "-142deg", delay: "0.54s" }
  ];

  /* Un ruban par place, dans l'ordre de la famille. */
  places.forEach(function (place, i) {
    /* Creation de l'image : on pointe le fichier SVG exporte de la VI. */
    var image = document.createElement("img");
    image.className = "cheer__ribbon";
    image.src = "/assets/" + famille[i % famille.length] + ".svg";
    /* Decor pur : pas de texte alternatif, la couche est deja aria-hidden. */
    image.alt = "";

    /* Trajectoire passee au CSS par variables, pour garder l'animation
       entierement declarative cote feuille de style. */
    image.style.setProperty("--x", place.x);
    image.style.setProperty("--y", place.y);
    image.style.setProperty("--w", place.w);
    image.style.setProperty("--r", place.r);
    image.style.setProperty("--delay", place.delay);

    gerbeRubans.appendChild(image);
  });
}


/* =====================================================================
   SECTION 11 — ENCHAINEMENT DES QUESTIONS
   ===================================================================== */

/* Fait sortir la carte courante puis affiche la suivante, ou le resultat. */
function questionSuivante() {
  /* Reference vers la carte a faire sortir. */
  var carteSortante = etat.carteCourante;

  if (carteSortante) {
    /* On retire la classe d'entree pour ne pas cumuler deux animations. */
    carteSortante.classList.remove("qcard--enter");
    /* Puis on declenche la sortie vers la gauche. */
    carteSortante.classList.add("qcard--exit");

    /* La carte est retiree du DOM une fois son animation finie. */
    setTimeout(function () {
      if (carteSortante.parentNode) {
        carteSortante.parentNode.removeChild(carteSortante);
      }
    }, 350);
  }

  /* Derniere question : on passe au resultat. */
  if (etat.index >= questions.length - 1) {
    terminerPartie();
    return;
  }

  /* Sinon, on avance d'un cran et on affiche la question suivante. */
  etat.index += 1;
  afficherQuestion();
}


/* =====================================================================
   SECTION 12 — FIN DE PARTIE
   ===================================================================== */

function terminerPartie() {
  /* Score total : points de reponses + bonus de vitesse. */
  var scoreTotal = etat.pointsBase + etat.pointsBonus;

  /* La case est validee si le seuil de bonnes reponses est atteint. */
  var validee = etat.bonnes >= SEUIL_VALIDATION;

  /* --- Badge de verdict --- */

  /* On repart d'un badge neutre, sans classe d'issue. */
  blocVerdict.className = "verdict " + (validee ? "verdict--passed" : "verdict--failed");

  /* Texte du badge. */
  texteVerdict.textContent = validee ? "Case validée" : "Case non validée";

  /* Icone du badge : une coche si c'est valide, une croix sinon.
     On ecrit le trace directement, plutot que d'ajouter une image. */
  iconeVerdict.innerHTML = validee
    ? '<path d="M4 12.5 L9.5 18 L20 6.5" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" />'
    : '<path d="M6 6 L18 18 M18 6 L6 18" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" />';

  /* --- Detail du calcul --- */

  /* Bonnes reponses sur le total de questions. */
  detailBonnes.textContent = etat.bonnes + " / " + questions.length;

  /* Points issus des bonnes reponses. */
  detailBase.textContent = String(etat.pointsBase);

  /* Points issus de la vitesse, prefixes d'un plus pour la lisibilite. */
  detailBonus.textContent = "+" + etat.pointsBonus;

  /* --- Barre du seuil --- */

  /* Le remplissage est proportionnel aux bonnes reponses. */
  var pourcentage = (etat.bonnes / questions.length) * 100;

  /* La couleur du remplissage suit l'issue de la partie. */
  remplissageSeuil.classList.toggle("is-failed", !validee);

  /* On repart de zero pour que la transition CSS soit visible.
     C'est scaleX qui porte le remplissage, pas width : la mise en page
     n'est pas recalculee a chaque image. */
  remplissageSeuil.style.transform = "scaleX(0)";

  /* --- Affichage --- */

  /* Bascule vers l'ecran de resultat. */
  afficherEcran(ecranResultat);

  /* Valeur cible appliquee a l'image suivante, pour declencher la
     transition CSS plutot qu'un saut instantane. */
  requestAnimationFrame(function () {
    remplissageSeuil.style.transform = "scaleX(" + (pourcentage / 100) + ")";
  });

  /* Gerbe de rubans de la charte, accordee a l'issue de la partie. */
  lancerGerbe(validee);

  /* Animation du compteur de score. */
  animerCompteur(scoreTotal);

  /* Publication du resultat vers le moteur du bingo. */
  publierResultat(validee, scoreTotal);
}

/* Fait grimper le compteur de 0 jusqu'au score final. */
function animerCompteur(scoreFinal) {
  /* Cas trivial : rien a animer si le score est nul. */
  if (scoreFinal <= 0) {
    compteurScore.textContent = "0";
    return;
  }

  /* Duree de l'animation, bornee pour rester agreable quel que soit le score. */
  var duree = Math.min(1200, 600 + scoreFinal * 0.4);

  /* Horodatage de la premiere image. Il est releve DANS la boucle, et non
     a l'appel : sinon le delai d'amorcage ci-dessous serait deja compte
     comme du temps ecoule, et le compteur demarrerait au milieu. */
  var depart = null;

  /* Si l'utilisateur a demande moins de mouvement, on affiche directement. */
  if (mouvementReduit()) {
    compteurScore.textContent = String(scoreFinal);
    return;
  }

  /* Boucle d'animation, une etape par image. */
  function etape(maintenant) {
    /* Premiere image : c'est elle qui fixe l'origine des temps. */
    if (depart === null) depart = maintenant;

    /* Progression bornee a [0, 1] : une horloge qui repart en arriere
       (onglet restaure, machine au ralenti) ne doit jamais produire de
       score negatif a l'ecran. */
    var t = Math.max(0, Math.min(1, (maintenant - depart) / duree));

    /* Adoucissement : depart rapide puis ralentissement (ease-out cubique). */
    var adouci = 1 - Math.pow(1 - t, 3);

    /* Valeur affichee, arrondie a l'entier. */
    compteurScore.textContent = String(Math.round(scoreFinal * adouci));

    /* Tant que l'animation n'est pas finie, on redemande une image. */
    if (t < 1) requestAnimationFrame(etape);
  }

  /* Lancement, legerement differe pour laisser l'ecran apparaitre. */
  setTimeout(function () {
    requestAnimationFrame(etape);
  }, 180);
}


/* =====================================================================
   SECTION 13 — INTERFACE DE SORTIE POUR LE MOTEUR DU BINGO
   Les deux canaux demandes dans le brief sont implementes, pour que le
   parent puisse brancher celui qu'il prefere.
   ===================================================================== */

/* Construit et diffuse l'objet resultat standardise. */
function publierResultat(validee, scoreTotal) {
  /* Objet resultat, au format exact attendu par le moteur du bingo. */
  var resultat = {
    gameId: GAME_ID,
    passed: validee,
    score: scoreTotal
  };

  /* Canal 1 : evenement custom sur window. */
  try {
    window.dispatchEvent(new CustomEvent("bingoGameResult", { detail: resultat }));
  } catch (erreur) {
    console.warn("[fun-facts-dz] CustomEvent indisponible :", erreur);
  }

  /* Canal 2 : fonction globale, si le parent en expose une. */
  if (typeof window.onBingoGameComplete === "function") {
    try {
      window.onBingoGameComplete(resultat);
    } catch (erreur) {
      console.warn("[fun-facts-dz] onBingoGameComplete a echoue :", erreur);
    }
  }

  /* Canal 3 : postMessage vers le parent, utile en integration iframe. */
  if (window.parent && window.parent !== window) {
    try {
      window.parent.postMessage({ type: "bingoGameResult", result: resultat }, "*");
    } catch (erreur) {
      console.warn("[fun-facts-dz] postMessage a echoue :", erreur);
    }
  }

  console.log("[fun-facts-dz] Résultat publié :", resultat);
}


/* =====================================================================
   SECTION 14 — CYCLE DE PARTIE
   ===================================================================== */

/* Remet tout a zero et tire une nouvelle grille de questions. */
function reinitialiserPartie() {
  /* Annulation d'un eventuel enchainement encore en attente. */
  if (etat.idTimeout !== null) {
    clearTimeout(etat.idTimeout);
    etat.idTimeout = null;
  }

  /* Annulation d'une eventuelle boucle de chrono encore active. */
  if (etat.idFrame !== null) {
    cancelAnimationFrame(etat.idFrame);
    etat.idFrame = null;
  }

  /* Remise a zero de tous les compteurs. */
  etat.index = 0;
  etat.bonnes = 0;
  etat.pointsBase = 0;
  etat.pointsBonus = 0;
  etat.verrouille = true;
  etat.carteCourante = null;

  /* La piste est videe de toute carte residuelle. */
  piste.innerHTML = "";

  /* Le score du HUD repart de zero. */
  scoreLive.textContent = "0";
  scoreLive.classList.remove("is-bumped");

  /* Le compteur de l'ecran de fin repart de zero lui aussi. */
  compteurScore.textContent = "0";

  /* Le decor est remis au repos : gerbe videe et pulsation annulee. */
  viderGerbe();
  if (idPulsationDecor !== null) {
    clearTimeout(idPulsationDecor);
    idPulsationDecor = null;
  }
  if (decor) decor.removeAttribute("data-pulse");

  /* Nouvelle grille tiree dans la banque : rejouer ne redonne pas la
     meme serie, et deux joueurs voisins n'ont pas les memes questions. */
  questions = tirerQuestions();

  /* Pastilles reconstruites a neuf, sur la grille qui vient d'etre tiree. */
  construirePips();
}

/* Lance une partie : reinitialisation, bascule d'ecran, premiere question. */
function demarrerPartie() {
  /* Etat propre. */
  reinitialiserPartie();

  /* Affichage de l'ecran de quiz. */
  afficherEcran(ecranQuiz);

  /* Affichage de la premiere question (qui demarre aussi le chrono). */
  afficherQuestion();
}


/* =====================================================================
   SECTION 15 — EVENEMENTS
   ===================================================================== */

/* Boutons de navigation. */
boutonDemarrer.addEventListener("click", demarrerPartie);
boutonRejouer.addEventListener("click", demarrerPartie);

/* Un seul ecouteur pour les deux boutons de reponse : la valeur est lue
   dans l'attribut data-value, donc ajouter un bouton ne change rien ici. */
zoneReponses.addEventListener("click", function (evenement) {
  /* On remonte depuis la cible jusqu'au bouton, au cas ou le clic ait
     atterri sur l'icone ou sur le libelle. */
  var bouton = evenement.target.closest(".btn-answer");
  if (!bouton || bouton.disabled) return;

  /* data-value vaut la chaine "true" ou "false". */
  traiterReponse(bouton.dataset.value === "true");
});

/* Raccourcis clavier : V pour Vrai, F pour Faux. */
document.addEventListener("keydown", function (evenement) {
  /* Les raccourcis ne valent que sur l'ecran de quiz. */
  if (!ecranQuiz.classList.contains("screen--active")) return;

  var touche = evenement.key.toLowerCase();
  if (touche !== "v" && touche !== "f") return;
  if (etat.verrouille) return;

  evenement.preventDefault();
  traiterReponse(touche === "v");
});

/* Onglet masque : on retire l'etat critique pour ne pas laisser une
   animation tourner en arriere-plan. */
document.addEventListener("visibilitychange", function () {
  if (document.hidden) blocChrono.classList.remove("is-critical");
});


/* =====================================================================
   SECTION 16 — AMORCAGE
   ===================================================================== */

/* Chargement des questions, puis preparation de l'ecran d'accueil. */
chargerQuestions()
  .then(function (nombre) {
    /* Aucune question exploitable : on previent plutot que d'afficher un vide. */
    if (nombre === 0) {
      boutonDemarrer.disabled = true;
      boutonDemarrer.querySelector("span").textContent = "Aucune question chargée";
      return;
    }

    /* Construction initiale des pastilles de progression. */
    construirePips();

    /* Trace utile pendant l'integration dans la grille du bingo. */
    console.log(
      "[fun-facts-dz] banque de " + nombre + " questions, " +
      QUESTIONS_PAR_PARTIE + " tirées par partie. Seuil : " + SEUIL_VALIDATION + "."
    );
  })
  .catch(function (erreur) {
    /* Filet de securite : aucune erreur ne doit rester silencieuse. */
    console.error("[fun-facts-dz] Échec de l'amorçage :", erreur);
  });
