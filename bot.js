import { Telegraf } from "telegraf";
import fetch from "node-fetch";
const token = "2087608808:AAGf3DiK9XhDUrHsvmX0Z_pB6ulrZs3r3bk"
const db="http://ergast.com/api/f1/current.json"

let array = []


const bot = new Telegraf(token)
bot.start((ctx)=>{
    ctx.reply("hola")
    fetch(db)
    .then(e=>e.json())
    .then(circuitos=>circuitos.MRData.RaceTable.Races.map(circuito=>{
        array=[...array,[{text:circuito.raceName, callback_data:circuito.Circuit.circuitId}]]
        bot.action(circuito.Circuit.circuitId,(ctx)=>{
           
         fetch(`http://ergast.com/api/f1/current/${circuito.round}/results.json`)
         .then(e=>e.json())
         .then(resultado=>resultado.MRData.RaceTable.Races.map(a=>a.Results.map(b=>ctx.reply(` ${b.position} - ${b.Driver.givenName}  ${b.Driver.familyName} - Vuelta rapida: ${b.FastestLap.Time.time}` ))))  
        })
        
    }))
})

bot.command("mostrar",(ctx)=>{
    ctx.telegram.sendMessage(ctx.chat.id,"Elegir Opcion:",
    { 
        reply_markup:{
            inline_keyboard: array    
    }
    })
})
//launch
bot.launch()