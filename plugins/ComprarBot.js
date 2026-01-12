const handler = async (m, {conn}) => {
  m.reply(global.ComprarBot);
};
handler.command ='comprarbot',/^(ComprarBot|Comprar|comprar|ComprarBot)$/i;
export default handler;

global.ComprarBot = `
〔 *Dolphin Bot V1* 〕

*BOT PARA GRUPO* :
> wa.me/529516526675

*BOT PERZONALIZADO* :
> wa.me/529516526675
`;