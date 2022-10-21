import "./css/index.css"
import IMask from "imask"
/*Acesso a primeira cor do cartão de crédito
O query selector significa buscar o seletor. Serve pra eu poder selecionar o elemento html da mesma maneira que eu criaria no css. No css eu coloco "Body{} ou id header{}".
-> ">g" significa o primeiro nível do g que tá dentro do svg.
-> g:nth-child(1) o primeiro g (pois tem 2) dentro do g principal de primeiro nivel.
*/
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }
  /*funcionalidade que modifica, atualiza
recebe 2 argumentos: o que eu quero modificar e o valor a ser modificado. */
  ccBgColor01.setAttribute("fill", colors[type][0]) //maneira de acessar uma propriedade do objeto através da variável.
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

setCardType("default")

//security code
const securityCode = document.querySelector("#security-code") //escolhi selecionar o cvc e alterar sua máscara
const securityCodePattern = {
  mask: "0000", //so aceitar 4 digitos
}
const securityCodeMasked = IMask(securityCode, securityCodePattern) //precisa dessa variável para rodar o codigo acima

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  //a estrutura do block está na documentação do IMask e serve para estipular limites/bloqueios
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2), //pegar o ano atual, mas apenas os dois ultimos numeros (22)
      to: String(new Date().getFullYear() + 10).slice(2), //pegar os proximos 10 anos, mas apenas os dois ultimos numeros(32)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9\d|}^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  //appended: sempre q eu clicar no teclado, o dispatch abaixo vai ocorrer
  dispatch: function (appended, dynamicMasked) {
    /*o dynamic inicia com 0, depois ele vai concatenando com os valores seguintes do appended. Por ex: digitei 4. 0+4 = 4, depois digitei 2.. 4 que ficou no dynamic + 2 = 42.
    Se nao for dígito, é pra substituir por vazio. */
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    //encontre no array de mascaras o elemento e retorne ele p usuario.
    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })
    console.log(foundMask)
    return foundMask
  },
}
const cardNumberMasked = (cardNumber, cardNumberPattern)
