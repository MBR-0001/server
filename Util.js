const Discord = require("discord.js");
const config = require("./config.json");

class Util {
    constructor() {
        throw new Error('This class cannot be instantiated!');
    }

    static get config() {
        return config;
    }

    /**
     * Log to a webhook
     * @param {string | Discord.MessageEmbed} message 
     */
    static log(message) {
        let url = process.env.LOG_WEBHOOK_URL;
        if (!url || !message) return false;

        url = url.replace("https://discordapp.com/api/webhooks/", "");
        let split = url.split("/");

        if (split.length < 2) return false;

        let client = new Discord.WebhookClient(split[0], split[1]);

        if (typeof(message) == "string") {
            for (let msg of Discord.Util.splitMessage(message, { maxLength: 1980 })) {
                client.send(msg, { avatarURL: Util.config.avatar, username: "Express-Logs" });
            }
        }

        else client.send(null, { embeds: [message], avatarURL: Util.config.avatar, username: "Express-Logs" });
        
        return true;
    }

    static get HTTP_Codes() {
        return {
            101: "101: Switching Protocols",
            200: "200: OK",
            201: "201: Created",
            204: "204: No Content",
            301: "301: Moved Permanently",
            303: "303: See Other",
            304: "304: Not Modified",
            400: "400: Bad Request",
            401: "401: Unauthorized",
            403: "403: Forbidden",
            404: "404: Not Found",
            405: "405: Method Not Allowed",
            406: "406: Not Acceptable",
            409: "409: Conflict",
            429: "429: Too Many Requests",
            500: "500: Internal Server Error",
            501: "501: Not Implemented",
            502: "502: Bad Gateway",
            503: "503: Service Unavailable"
        }
    }

    /**
     * @param {Response} res 
     * @param {Number} code 
     * @param {Object} object 
     */
    static SendResponse(res, code, obj = null, pretty = true) {
        if (!res || !code) throw new Error("Invalid Args");
        if (!(code in Util.HTTP_Codes)) throw new Error(code + " is not a valid HTTP status code");

        if (obj == null || obj == undefined) {
            return res.status(code).set("Content-Type", "application/json").send(JSON.stringify({code: code, message: Util.HTTP_Codes[code]}));
        }
        
        return res.status(code).set("Content-Type", "application/json").send(JSON.stringify(obj, null, pretty ? 2 : 0));
    }

    static IPFromRequest(req) {
        let IP = req.ip;
        if (!IP) return "MISSING IP";

        IP = IP.replace("::ffff:", "").replace("::1", "");
        return !IP ? "127.0.0.1" : IP;
    }
}
module.exports = Util;
