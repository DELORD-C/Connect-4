$.fn.puissance = function (x, y, one, two, nbplayers) {

    class Initiate {

        constructor(a, b) {
            this.turn = 1;
            this.scorea = a;
            this.scoreb = b;
        }

        generateGrid(object) {
            if (x < 4) {
                x = 4;
                console.log("4 lignes minimum !");
            }

            if (y < 4) {
                y = 4;
                console.log("4 colonnes minimum !");
            }

            var htmlin = "";
            for (var i = 1; i <= x; i++) {
                htmlin += "<div class='puissance-col' x='" + i + "' fil='0'>\n";
                for (var j = 1; j <= y; j++) {
                    htmlin += "  <div class='puissance-case' x='" + i + "' y='" + j + "' filled='0'><img src='src/puissance.png' alt='case-puissance'></div>\n";
                }
                htmlin += "</div>\n";
            }

            $(object).html(htmlin);
        };

        setScores(object) {
            $(object).before("<div class='playing'>Tour du joueur 1</div>");
            $(object).before("<div class='scores'><h1>" + Init.scorea + " </h1>||<h2> " + Init.scoreb + "</h2></div>");
            $(object).before("<button class='puissance-return'>Annuler dernier coup</button>");
            $('.scores').children('h1').css("color", one);
            $('.scores').children('h2').css("color", two);
        }

        updateScores(scorea, scoreb) {
            $('.scores').html("Joueur 1 : " + scorea + " points || Joueur 2 : " + scoreb + " points");
        }

        setSize(object) {
            var totalwidth = x * 100;
            var totalheight = y * 100 - 10;
            $(object).css("width", totalwidth + "px");
            $(object).css("height", totalheight + "px");
        }

    }

    class Infos {
        constructor(one, two) {
            this.one = one;
            this.two = two;
            this.player = this.one;
            this.turn = 0;
            this.victory = 0;
            this.actual = 1;
            this.lastx = 0;
            this.lasty = 0;
            this.select = 0;
            $('.playing').css("color", this.player);
        }

        togglePlayer() {
            if (this.player == this.one) {
                this.player = this.two;
                if (nbplayers == 1) {
                $('.playing').html("Tour de l'ordinateur");
                }
                else {
                $('.playing').html("Tour du Joueur 2");
                }
                $('.playing').css("color", this.player);
                this.actual = 2;
            } else {
                this.player = this.one;
                $('.playing').html("Tour du Joueur 1");
                $('.playing').css("color", this.player);
                this.actual = 1;
            }
        }

        computer(row, col) {
            this.ifVictory(col, row);
        }

        complay(target) {
            var that = this;
            fil = $(target).attr("fil");
            if (fil <= y) {
                fil++;
                $(target).attr("fil", fil);
                var playing = 0;
                $(target).children('.puissance-case').each(function () {
                    if (y - $(this).attr("y") + 1 == fil) {
                        row = $(this).attr("x");
                        col = $(this).attr("y");
                        that.lastx = row;
                        that.lasty = col;
                        that.turnStart();
                        $(this).append("<img class='puissance-pawn' src='src/" + that.player + ".png' alt='Pawn'>");
                        $(this).attr("filled", that.actual);
                        $(this).children('.puissance-pawn').css('margin-top', -100 * y + "px");
                        jeton = $('.puissance-pawn');
                        playing = this;

                    }
                });
                if (playing != 0) {
                    setTimeout(function () {
                        that.fall(playing)
                    }, 100);
                    setTimeout(function () {
                        that.bounce(playing)
                    }, 440);
                    setTimeout(function () {
                        that.fall(playing)
                    }, 650);
                    setTimeout(function () {
                        that.rebounce(playing)
                    }, 820);
                    setTimeout(function () {
                        that.fallfinish(playing)
                    }, 1000);
                    setTimeout(function () {
                        that.turnFinish(row, col, Init)
                    }, 1000);
                }
            }
        }

        playRandom() {
            var xrand = Math.floor((Math.random() * x) + 1);
            var play = 0;
            $('.puissance-col').each(function () {
                if ($(this).attr('x') == xrand) {
                    if ($(this).attr('fil') < y) {
                        play = this;
                    }
                }
            });
            if (play != 0) {
                this.complay(play);
            } else {
                this.playRandom();
            }
        }

        selectCell(row, col) {
            var that = this;
            $('.puissance-case').each(function () {
                if ($(this).attr('x') == row && $(this).attr('y') == col) {
                    var lol = this;
                    that.select = this;
                }
            });
        }

        checkDoubleCounter() {
            col = parseInt(col);
            row = parseInt(row);
            var that = this;
            var nbrx = 0;
            var nbry = 0;
            var cell = 0;
            var cellb = 0;
            var checkx = 0;
            var checky = 0;

            $('.puissance-case').each(function () {
                if ($(this).attr('filled') == 1) {
                    nbrx = $(this).attr('x');
                    nbry = $(this).attr('y');
                    var top = "none";
                    var bot = "none";
                    var left = "none";
                    var right = "none";
                    var da = "none";
                    var db = "none";
                    var dc = "none";
                    var dd = "none";

                    $('.puissance-case').each(function () {
                        checkx = $(this).attr('x');
                        checky = $(this).attr('y');
                        if (checky == nbry && checkx == nbrx - 1) {
                            if ($(this).attr('filled') == 1) {
                                left = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                left = this;
                            }
                        }
                        if (checky == nbry && checkx == parseInt(nbrx) + 1) {
                            if ($(this).attr('filled') == 1) {
                                right = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                right = this;
                            }
                        }
                        if (checky == nbry - 1 && checkx == nbrx) {
                            if ($(this).attr('filled') == 1) {
                                top = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                top = this;
                            }
                        }
                        if (checky == parseInt(nbry) + 1 && checkx == nbrx) {
                            if ($(this).attr('filled') == 1) {
                                bot = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                bot = this;
                            }
                        }
                        if (checky == parseInt(nbry) - 1 && checkx == parseInt(nbrx) - 1) {
                            if ($(this).attr('filled') == 1) {
                                da = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                da = this;
                            }
                        }
                        if (checky == parseInt(nbry) + 1 && checkx == parseInt(nbrx) + 1) {
                            if ($(this).attr('filled') == 1) {
                                db = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                db = this;
                            }
                        }
                        if (checky == parseInt(nbry) - 1 && checkx == parseInt(nbrx) + 1) {
                            if ($(this).attr('filled') == 1) {
                                dc = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                dc = this;
                            }
                        }
                        if (checky == parseInt(nbry) + 1 && checkx == parseInt(nbrx) - 1) {
                            if ($(this).attr('filled') == 1) {
                                dd = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                dd = this;
                            }
                        }
                    });

                    if (left != 'none' && right != 'none' && cell == 0) {
                        if (left == 'fil' && right != 'fil') {
                            if ($(right).attr('y') != y) {
                                that.selectCell($(right).attr('x'), parseInt($(right).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cell = right;
                                }
                            } else {
                                cell = right;
                            }
                        }
                        if (left != 'fil' && right == 'fil') {
                            if ($(left).attr('y') != y) {
                                that.selectCell($(left).attr('x'), parseInt($(left).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cell = left;
                                }
                            } else {
                                cell = left;
                            }
                        }
                    }

                    if (top != 'none' && bot != 'none' && cell == 0) {
                        if (top != 'fil') {
                            cell = top;
                        }
                    }

                    if (dc != 'none' && cell == 0 && dd != 'none') {
                        if (dc == 'fil' && dd != 'fil') {
                            if ($(dd).attr('y') != y) {
                                that.selectCell($(dd).attr('x'), parseInt($(dd).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cell = dd;
                                }
                            } else {
                                cell = dd;
                            }
                        }
                        if (dd == 'fil' && dc != 'fil') {
                            if ($(dc).attr('y') != y) {
                                that.selectCell($(dc).attr('x'), parseInt($(dc).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cell = dc;
                                }
                            } else {
                                cell = dc;
                            }
                        }
                    }

                    if (da != 'none' && cell == 0 && db != 'none') {
                        if (da == 'fil' && db != 'fil') {
                            if ($(db).attr('y') != y) {
                                that.selectCell($(db).attr('x'), parseInt($(db).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cell = db;
                                }
                            } else {
                                cell = db;
                            }
                        }
                        if (db == 'fil' && da != 'fil') {
                            if ($(da).attr('y') != y) {
                                that.selectCell($(da).attr('x'), parseInt($(da).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cell = da;
                                }
                            } else {
                                cell = da;
                            }
                        }
                    }

                }
            });

            return cell;

        }

        checkDoublePlace() {

            col = parseInt(col);
            row = parseInt(row);
            var that = this;
            var nbrx = 0;
            var nbry = 0;
            var cell = 0;
            var cellb = 0;
            var checkx = 0;
            var checky = 0;

            $('.puissance-case').each(function () {
                if ($(this).attr('filled') == 2) {
                    nbrx = $(this).attr('x');
                    nbry = $(this).attr('y');
                    var top = "none";
                    var bot = "none";
                    var left = "none";
                    var right = "none";
                    var da = "none";
                    var db = "none";
                    var dc = "none";
                    var dd = "none";


                    $('.puissance-case').each(function () {
                        checkx = $(this).attr('x');
                        checky = $(this).attr('y');
                        if (checky == nbry && checkx == nbrx - 1) {
                            if ($(this).attr('filled') == 2) {
                                left = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                left = this;
                            }
                        }
                        if (checky == nbry && checkx == parseInt(nbrx) + 1) {
                            if ($(this).attr('filled') == 2) {
                                right = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                right = this;
                            }
                        }
                        if (checky == nbry - 1 && checkx == nbrx) {
                            if ($(this).attr('filled') == 2) {
                                top = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                top = this;
                            }
                        }
                        if (checky == parseInt(nbry) + 1 && checkx == nbrx) {
                            if ($(this).attr('filled') == 2) {
                                bot = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                bot = this;
                            }
                        }
                        if (checky == parseInt(nbry) - 1 && checkx == parseInt(nbrx) - 1) {
                            if ($(this).attr('filled') == 2) {
                                da = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                da = this;
                            }
                        }
                        if (checky == parseInt(nbry) + 1 && checkx == parseInt(nbrx) + 1) {
                            if ($(this).attr('filled') == 2) {
                                db = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                db = this;
                            }
                        }
                        if (checky == parseInt(nbry) - 1 && checkx == parseInt(nbrx) + 1) {
                            if ($(this).attr('filled') == 2) {
                                dc = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                dc = this;
                            }
                        }
                        if (checky == parseInt(nbry) + 1 && checkx == parseInt(nbrx) - 1) {
                            if ($(this).attr('filled') == 2) {
                                dd = 'fil';
                            } else if ($(this).attr('filled') == 0) {
                                dd = this;
                            }
                        }
                    });

                    if (left != 'none' && right != 'none' && cellb == 0) {
                        if (left == 'fil' && right != 'fil') {
                            if ($(right).attr('y') != y) {
                                that.selectCell($(right).attr('x'), parseInt($(right).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cellb = right;
                                }
                            } else {
                                cellb = right;
                            }
                        }
                        if (left != 'fil' && right == 'fil') {
                            if ($(left).attr('y') != y) {
                                that.selectCell($(left).attr('x'), parseInt($(left).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cellb = left;
                                }
                            } else {
                                cellb = left;
                            }
                        }
                    }

                    if (top != 'none' && bot != 'none' && cellb == 0) {
                        if (top != 'fil') {
                            cellb = top;
                        }
                    }

                    if (dc != 'none' && cellb == 0 && dd != 'none') {
                        if (dc == 'fil' && dd != 'fil') {
                            if ($(dd).attr('y') != y) {
                                that.selectCell($(dd).attr('x'), parseInt($(dd).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cellb = dd;
                                }
                            } else {
                                cellb = dd;
                            }
                        }
                        if (dd == 'fil' && dc != 'fil') {
                            if ($(dc).attr('y') != y) {
                                that.selectCell($(dc).attr('x'), parseInt($(dc).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cellb = dc;
                                }
                            } else {
                                cellb = dc;
                            }
                        }
                    }

                    if (da != 'none' && cellb == 0 && db != 'none') {
                        if (da == 'fil' && db != 'fil') {
                            if ($(db).attr('y') != y) {
                                that.selectCell($(db).attr('x'), parseInt($(db).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cellb = db;
                                }
                            } else {
                                cellb = db;
                            }
                        }
                        if (db == 'fil' && da != 'fil') {
                            if ($(da).attr('y') != y) {
                                that.selectCell($(da).attr('x'), parseInt($(da).attr('y')) + 1);
                                if ($(that.select).attr('filled') != 0) {
                                    cellb = da;
                                }
                            } else {
                                cellb = da;
                            }
                        }
                    }

                }
            });

            return cellb;
        }

        checkWinPlace() {
            col = parseInt(col);
            row = parseInt(row);
            var that = this;
            var nbra = 0;
            var nbrb = 0;
            var temp = 0;

            $('.puissance-case').each(function () {
                // console.log(this);
            });

            return 0;
        }

        checkPlace() {
            return 0;
        }

        ifVictory(col, row) {

            var played = 0;
            var that = this;
            var winner = this.checkWinPlace();
            var cell = this.checkDoubleCounter();
            var cellb = this.checkDoublePlace();
            var cellz = this.checkPlace();

            if (winner != 0 && played == 0) {
                played = 1;
                console.log('win');
                that.complay($(winner).parent());
            }

            if (cell != 0 && played == 0) {
                played = 1;
                console.log('counter');
                that.complay($(cell).parent());
            }

            if (cellb != 0 && played == 0) {
                played = 1;
                console.log('combo');
                that.complay($(cellb).parent());
            }

            if (cellz != 0 && played == 0) {
                played = 1;
                console.log('place');
                that.complay($(cellz).parent());
            }

            if (played == 0 && that.player == that.two) {
                played = 1;
                console.log('random');
                that.playRandom();
            }
        }

        fall(target) {
            $('.puissance-pawn').css("transition-duration", "0.5s");
            $(target).children('.puissance-pawn').css('margin-top', "50px");
        }

        bounce(target) {
            $('.puissance-pawn').css("transition-duration", "0.3s");
            $(target).children('.puissance-pawn').css('margin-top', "-70px");
        }

        rebounce(target) {
            $('.puissance-pawn').css("transition-duration", "0.2s");
            $(target).children('.puissance-pawn').css('margin-top', "-15px");
        }

        fallfinish(target) {
            $('.puissance-pawn').css("transition-duration", "0.4s");
            $(target).children('.puissance-pawn').css('margin-top', "0px");
        }

        turnStart() {
            this.turn = 1;
        }

        turnFinish(row, col, Init) {
            this.checkVictoryhor(col);
            this.checkVictoryver(row);
            this.checkVictorydiab(row, col);
            this.checkVictorydiah(row, col);
            if (this.victory == 0) {
                this.checkDraw();
                this.togglePlayer();
                this.turn = 0;
                if (this.player == this.two && nbplayers == 1) {
                    this.computer(row, col);
                }
            } else {
                this.Win(Init);
            }
        }

        checkVictoryhor(col) {
            var nbra = 0;
            var nbrb = 0;
            var victory = 0;
            $('.puissance-case').each(function () {
                if ($(this).attr('y') == col) {
                    if ($(this).attr('filled') == 1) {
                        nbra++;
                    } else {
                        nbra = 0;
                    }
                    if ($(this).attr('filled') == 2) {
                        nbrb++;
                    } else {
                        nbrb = 0;
                    }
                    if (nbra >= 4 || nbrb >= 4) {
                        victory = 1;
                    }
                }
            });
            if (victory == 1) {
                this.victory = 1;
            }
        }

        checkVictoryver(row) {
            var nbra = 0;
            var nbrb = 0;
            var victory = 0;
            $('.puissance-case').each(function () {
                if ($(this).attr('x') == row) {
                    if ($(this).attr('filled') == 1) {
                        nbra++;
                    } else {
                        nbra = 0;
                    }
                    if ($(this).attr('filled') == 2) {
                        nbrb++;
                    } else {
                        nbrb = 0;
                    }
                    if (nbra >= 4 || nbrb >= 4) {
                        victory = 1;
                    }
                }
            });
            if (victory == 1) {
                this.victory = 1;
            }
        }

        checkVictorydiab(row, col) {
            var nbra = 0;
            var nbrb = 0;
            var victory = 0;
            row = parseInt(row);
            col = parseInt(col);
            $('.puissance-case').each(function () {
                var xnow = $(this).attr('x');
                var ynow = $(this).attr('y');
                for (var a = 3; a >= 0; a--) {
                    if ((xnow == row - a && ynow == col - a) || (xnow == row + a && ynow == col + a)) {
                        if ($(this).attr('filled') == 1) {
                            nbra++;
                        } else {
                            nbra = 0;
                        }
                        if ($(this).attr('filled') == 2) {
                            nbrb++;
                        } else {
                            nbrb = 0;
                        }
                        if (nbra >= 4 || nbrb >= 4) {
                            victory = 1;
                        }
                    }
                }
            });
            if (victory == 1) {
                this.victory = 1;
            }
        }

        checkVictorydiah(row, col) {
            var nbra = 0;
            var nbrb = 0;
            var victory = 0;
            row = parseInt(row);
            col = parseInt(col);
            $('.puissance-case').each(function () {
                var xnow = $(this).attr('x');
                var ynow = $(this).attr('y');
                for (var a = 3; a >= 0; a--) {
                    if ((xnow == row + a && ynow == col - a) || (xnow == row - a && ynow == col + a)) {
                        if ($(this).attr('filled') == 1) {
                            nbra++;
                        } else {
                            nbra = 0;
                        }
                        if ($(this).attr('filled') == 2) {
                            nbrb++;
                        } else {
                            nbrb = 0;
                        }
                        if (nbra >= 4 || nbrb >= 4) {
                            victory = 1;
                        }
                    }
                }
            });
            if (victory == 1) {
                this.victory = 1;
            }
        }

        checkDraw() {
            var total = x;
            $('.puissance-col').each(function(){
                if ($(this).attr('fil') != y) {
                    total--;
                }
            });
            if (total == x) {
                this.Draw(Init);
            }
        }

        Win(Init) {
            if ((this.actual) == 1) {
                var scorea = Init.scorea + 1;
                var scoreb = Init.scoreb;
            } else {
                var scorea = Init.scorea;
                var scoreb = Init.scoreb + 1;
            }

            alert("Le Joueur " + this.actual + " à gagné !");
            this.actual = 1;
            this.turn = 0;
            Init.updateScores(scorea, scoreb);
            window.location = "http://localhost?one=" + scorea + "&two=" + scoreb;
        }

        Draw(Init) {
            alert("Match nul !");
            this.actual = 1;
            this.turn = 0;
            window.location = "http://localhost?one=" + scorea + "&two=" + scoreb;
        }
    }

    function $_GET(param) {
        var vars = {};
        window.location.href.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function (m, key, value) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );

        if (param) {
            return vars[param] ? vars[param] : null;
        }
        return vars;
    }



    var scorea = $_GET('one');
    var scoreb = $_GET('two');
    if (scorea === null) {
        scorea = 0;
    } else {
        scorea = parseInt(scorea);
    }
    if (scoreb === null) {
        scoreb = 0;
    } else {
        scoreb = parseInt(scoreb);
    }
    if (one == two) {
        switch (one) {
            case "red":
                two = "blue";
                break;

            case "blue":
                two = "red";
                break;

            case "green":
                two = "yellow";
                break;

            case "yellow":
                two = "green";
                break;

            default:
                break;
        }
    }

    var Init = new Initiate(scorea, scoreb);
    Init.generateGrid(this);
    Init.setSize(this);
    Init.setScores(this);
    Infos = new Infos(one, two);

    $('.puissance-return').click(function () {
        lastx = Infos.lastx;
        lasty = Infos.lasty;
        $('.puissance-case').each(function () {
            alastx = $(this).attr('x');
            alasty = $(this).attr('y');
            if (alastx == lastx && alasty == lasty && Infos.turn == 0) {
                if ($(this).attr('filled') != 0) {
                    $(this).attr('filled', '0');
                    $(this).html("<img src='src/puissance.png' alt='case-puissance'>")
                    afil = $(this).parent().attr('fil') - 1;
                    $(this).parent().attr('fil', afil);
                    Infos.turnFinish();
                }
            }
        });
    });

    $('.puissance-col').click(function () {
        fil = $(this).attr("fil");
        if (fil <= y && Infos.turn == 0) {
            fil++;
            $(this).attr("fil", fil);
            $(this).children('.puissance-case').each(function () {
                if (y - $(this).attr("y") + 1 == fil) {
                    row = $(this).attr("x");
                    col = $(this).attr("y");
                    Infos.lastx = row;
                    Infos.lasty = col;
                    Infos.turnStart();
                    $(this).append("<img class='puissance-pawn' src='src/" + Infos.player + ".png' alt='Pawn'>");
                    $(this).attr("filled", Infos.actual);
                    $(this).children('.puissance-pawn').css('margin-top', -100 * y + "px");
                    target = this;
                    jeton = $('.puissance-pawn');
                    setTimeout(function () {
                        Infos.fall(target)
                    }, 100);
                    setTimeout(function () {
                        Infos.bounce(target)
                    }, 440);
                    setTimeout(function () {
                        Infos.fall(target)
                    }, 650);
                    setTimeout(function () {
                        Infos.rebounce(target)
                    }, 820);
                    setTimeout(function () {
                        Infos.fallfinish(target)
                    }, 1000);
                    setTimeout(function () {
                        Infos.turnFinish(row, col, Init)
                    }, 1000);
                }
            });
        }
    });
};