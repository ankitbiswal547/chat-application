const getMessages = (text, username) => {
    return {
        text:text,
        username:username,
        createdAt: new Date().getTime()
    }
}

const generateURLMessages = (url, username) => {
    return {
        url: url,
        username:username,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    getMessages:getMessages,
    generateURLMessages
}