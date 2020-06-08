const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

const csvWriter = require('csv-writer').createObjectCsvWriter({
    path: 'data.csv',
    header: [
        {id: 'name', title: 'Name'},
        {id: 'surname', title: 'Surname'},
        {id: 'age', title: 'Age'},
        {id: 'gender', title: 'Gender'}
    ]
})

const data = [
    {
        name: 'John',
        surname: 'Snow',
        age: 26,
        gender: 'M'
    },
    {
        name: 'Clair',
        surname: 'White',
        age: 33,
        gender: 'F'
    },
    {
        name: 'Fancy',
        surname: 'Brown',
        age: 78,
        gender: 'F'
    },
    {
        name: 'Bill',
        surname: 'Fleyer',
        age: 46,
        gender: 'M'
    },
    {
        name: 'Jan',
        surname: 'Peters',
        age: 21,
        gender: 'F'
    },
    {
        name: 'Larry',
        surname: 'Conner',
        age: 36,
        gender: 'M'
    },
    {
        name: 'Patty',
        surname: 'Lyers',
        age: 86,
        gender: 'F'
    },
    {
        name: 'Cal',
        surname: 'Bannerman',
        age: 66,
        gender: 'M'
    }
]

csvWriter.writeRecords(data)

const males = []
const females = []
for (const x of data){
    if (x.gender === 'M'){
        males.push(x)
    } else if (x.gender === 'F'){
        females.push(x)
    }
}

fs.writeFileSync('males.json', JSON.stringify(males))
fs.writeFileSync('females.json', JSON.stringify(females))



const server = http.createServer((req, res) => {
    if (req.url === '/'){
        res.writeHead(200, {
            'Content-Type': 'text/html' 
        })
        fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(res)
    } else if (req.url === '/males'){
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(males))
    } else if (req.url === '/females'){
        res.writeHead(200, {
            'Content-Type': 'application/json'
        })
        res.end(JSON.stringify(females))
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        })
        fs.createReadStream(__dirname + '/404.html', 'utf8').pipe(res)
    }
})

server.listen(3000, () => {
    console.log('Listening on port 3000')
})

const gzip = zlib.createGzip()
const maleRStream = fs.createReadStream('males.json')
const maleWStream = fs.createWriteStream('malezipfile.json.gz')
const femaleRStream = fs.createReadStream('females.json')
const femaleWStream = fs.createWriteStream('femalezipfile.json.gz')

maleRStream.pipe(gzip).pipe(maleWStream)
femaleRStream.pipe(gzip).pipe(maleWStream)