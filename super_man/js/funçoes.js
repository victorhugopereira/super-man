function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Kriptonita(reversa = false) {
    this.elemento = novoElemento('div', 'kriptonita')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)


    this.setAltura = altura => corpo.style.height = `${altura}px`

}


function ParDeKriptonitas(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-kriptonita')

    this.superior = new Kriptonita(true)
    this.inferior = new Kriptonita(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clientWidth


    this.sortearAbertura()
    this.setX(x)
}

function Kriptonitas(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeKriptonitas(altura, abertura, largura),
        new ParDeKriptonitas(altura, abertura, largura + espaco),
        new ParDeKriptonitas(altura, abertura, largura + espaco * 2),
        new ParDeKriptonitas(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if (cruzouOMeio) notificarPonto()
        })
    }
}


function Superman(alturaJogo) {
    let voando = false
    this.elemento = novoElemento('img', 'superman')
    this.elemento.src = 'imgs/superman.gif'
    

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true

    window.onkeyup = e => voando = false

    

    this.animar = () => {
        const novoY = this.getY() + (voando ? 6 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight
        
        

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)

        }
    }
    this.setY(alturaJogo / 2)
}

function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()


    const horizontal = a.left + a.width >= b.left
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top
        && b.top + b.height >= a.top
    return horizontal && vertical
}
function colisao(superman, kriptonitas) {
    let colisao = false
    kriptonitas.pares.forEach(parDeKriptonitas => {
        if (!colisao) {
            const superior = parDeKriptonitas.superior.elemento
            const inferior = parDeKriptonitas.inferior.elemento
            colisao = estaoSobrepostos(superman.elemento, superior)
                || estaoSobrepostos(superman.elemento, inferior)
        } else {
            GamerOver()
            
        }
        
    
        
    })

    return colisao
}


function GamerOver() {
    const areaDoJogo = document.querySelector('[wm-manfly]')
    this.elemento = novoElemento('span', 'Game-over')
    this.elemento.innerHTML = 'Perdeu'
    areaDoJogo.appendChild(this.elemento)
    
}

function SupermanStart() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-manfly]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const kriptonitas = new Kriptonitas(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos))
    const superman = new Superman(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(superman.elemento)
    kriptonitas.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        //loop do game
        const temporizador = setInterval(() => {
            kriptonitas.animar()
            superman.animar()

            if (colisao(superman, kriptonitas)) {
                clearInterval(temporizador)

                setTimeout(() => {
                    window.location.reload()
                }, 1000);

            }
        }, 20)
    }
}
new SupermanStart().start()


