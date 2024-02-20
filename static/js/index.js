let n = 10;
let robot = 'rgb(34, 33, 33)';
let human = 'rgb(194, 191, 191)';
let used = new Set();

let hasUsed = (x, y) => {
    return used.has(x + " " + y);
};

let addUsed = (x, y) => {
    return used.add(x + " " + y);
};

let getColumn = function(x, y) {
    let s = `<div class="column r${x} c${y}"><div class="cell r${x} c${y}"></div></div>`;
    return s;
};

let getRow = function(x) {
    let s = `<div class="row r${x}">`;
    for (let i = 1; i <= n; i ++) {
        s += getColumn(x, i);
    }
    s += "</div>";
    return s;
};

let getGrid = () => {
    let grid = document.querySelector(".grid");
    for (let i = 1; i <= n; i ++) {
        grid.innerHTML += getRow(i);
    }
}

let getElem = (x, y) => {
    return document.querySelector(`.cell.r${x}.c${y}`);
};

// 人类下棋
let humanChess = (e) => {
    let ls = e.target.className.split(" ");
    if (ls[0] != "cell" && ls[0] != "column") return false;
    let x = ls[1].substr(1);
    let y = ls[2].substr(1);
    if (hasUsed(x, y)) {
        // let cell = getElem(x, y);
        // cell.style.backgroundColor = robot;
        return false;
    }
    addUsed(x, y);
    let cell = getElem(x, y);
    cell.style.backgroundColor = human;
    return true;
};

let getElemColor = (x, y) => {
    return getElem(x, y).style.backgroundColor;
};

let setElemColor = (x, y, c) => {
    getElem(x, y).style.backgroundColor = c;
}

// 记忆化递归
let inf = 1 << 20;
let dp = {};
// 敌方能放松考虑多少步？
let debugCnt = 0;
let _score = (s) => {
    // if (++ debugCnt <= 100) {
    //     console.log(s);
    // }
    // console.log(s);
    if (dp[s] != undefined) return dp[s];
    if (s.length < 5) {
        dp[s] = inf;
        return inf;
    }
    let len = 0;
    let four = false;
    for (let i = 0; i < s.length; i ++) {
        if (s[i] == '1') len ++;
        else {
            if (len >= 5) {
                dp[s] = 0;
                return 0;
            }
            if (len == 4) {
                four = true;
            }
            len = 0;
        }
    }
    if (len >= 5) {
        dp[s] = 0;
        return 0;
    }
    if (four == 4) {
        dp[s] = 0.5;
        return;
    }
    dp[s] = inf;
    for (let i = 0; i < s.length; i ++) {
        if (s[i] == '1') continue;
        let ts = s.substring(0, i);
        ts += '1';
        ts += s.substring(i + 1, s.length);
        let res = _score(ts) + 1;
        dp[s] = Math.min(dp[s], res);
    }
    return dp[s];
} 

let score = (s) => {
    dp = {};
    return _score(s);
};

let yy = (x, y) => {
    let ans = 0;
    let s = "1";
    let ts = "";
    for (let i = y - 1; i > 0; i --) {
        let tc = getElemColor(x, i);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = y + 1; i <= n; i ++) {
        let tc = getElemColor(x, i);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    ans = score(s);

    s = "1";
    ts = "";
    for (let i = y - 1; i > 0; i --) {
        let tc = getElemColor(x, i);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = y + 1; i <= n; i ++) {
        let tc = getElemColor(x, i);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }

    ans = Math.min(ans, score(s));
    return ans;
};
 
let xy = (x, y) => {
    let ans = 0;
    let s = "1";
    let ts = "";
    for (let i = 1; i < Math.min(x, y); i ++) {
        let tc = getElemColor(x - i, y - i);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = 1; i <= n - Math.max(x, y); i ++) {
        let tc = getElemColor(x + i, y + i);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    ans = score(s);

    s = "1";
    ts = "";
    for (let i = 1; i < Math.min(x, y); i ++) {
        let tc = getElemColor(x - i, y - i);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = 1; i <= n - Math.max(x, y); i ++) {
        let tc = getElemColor(x + i, y + i);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }

    ans = Math.min(ans, score(s));
    return ans;
};

let xx = (x, y) => {
    let ans = 0;
    let s = "1";
    let ts = "";
    for (let i = x - 1; i > 0; i --) {
        let tc = getElemColor(i, y);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = x + 1; i <= n; i ++) {
        let tc = getElemColor(i, y);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    ans = score(s);

    s = "1";
    ts = "";
    for (let i = x - 1; i > 0; i --) {
        let tc = getElemColor(i, y);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = x + 1; i <= n; i ++) {
        let tc = getElemColor(i, y);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    
    ans = Math.min(ans, score(s));
    return ans;
};

let yx = (x, y) => {
    let ans = 0;
    let s = "1";
    let ts = "";
    for (let i = 1; x + i <= n && y - i > 0; i ++) {
        let tc = getElemColor(x + i, y - i);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = 1; x - i > 0 && y + i <= n; i ++) {
        let tc = getElemColor(x - i, y + i);
        if (tc == "" || tc == human) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    ans = score(s);

    s = "1";
    ts = "";
    for (let i = 1; x + i <= n && y - i > 0; i ++) {
        let tc = getElemColor(x + i, y - i);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    s = ts;
    for (let i = 1; x - i > 0 && y + i <= n; i ++) {
        let tc = getElemColor(x - i, y + i);
        if (tc == "" || tc == robot) {
            s += tc == "" ? "0" : "1";
        }
        else break;
    }

    ans = Math.min(ans, score(s));
    return ans;
};

let chessScore = (x, y) => {
    let ans = [
        xx(x, y),
        yy(x, y),
        xy(x, y),
        yx(x, y)
    ];
    ans.sort();
    return ans;
};

// 机器人下棋
let robotChess = () => {
    let p = [0, 0], sc = [
        inf, inf, inf, inf
    ];
    for (let i = 1; i <= n; i ++) {
        for (let j = 1; j <= n; j ++) {
            if (hasUsed(i, j)) {
                continue;
            }
            
            let a = chessScore(i, j);
            for (let k = 0; k < 4; k ++) {
                if (sc[k] > a[k]) {
                    sc = a;
                    p = [i, j];
                    break;
                }
                else if (sc[k] < a[k])
                    break;
            }
        }
    }
    addUsed(p[0], p[1]);
    console.log(...p, ": ", ...sc);
    setElemColor(p[0], p[1], robot);
};

let gameOver = (s) => {
    let len = 0;
    for (let i = 0; i < s.length; i ++) {
        if (s[i] == '1') len ++;
        else {
            if (len >= 5) return true;
            len = 0;
        }
    }
    if (len >= 5) return true;
    return false;
};

let ok = (c) => {
    for (let i = 1; i <= n; i ++) {
        let s = "";
        for (let j = 1; j <= n; j ++) {
            if (getElemColor(i, j) == c) s += 1;
            else s += "0";
        }
        if (gameOver(s)) {
            return true;
        }
    }
    for (let i = 1; i <= n; i ++) {
        let s = "";
        for (let j = 1; j <= n; j ++) {
            if (getElemColor(j, i) == c) s += 1;
            else s += "0";
        }
        if (gameOver(s)) {
            return true;
        }
    }
    for (let i = 1; i <= n; i ++) {
        let s = "";
        for (let j = 0; 1 + j <= n && i + j <= n; j ++) {
            if (getElemColor(1 + j, i + j) == c) s += 1;
            else s += "0";
        }
        if (gameOver(s)) {
            return true;
        }
    }
    for (let i = 1; i <= n; i ++) {
        let s = "";
        for (let j = 0; 1 + j <= n && i + j <= n; j ++) {
            if (getElemColor(i + j, 1 + j) == c) s += 1;
            else s += "0";
        }
        if (gameOver(s)) {
            return true;
        }
    }
    for (let i = 1; i <= n; i ++) {
        let s = "";
        for (let j = 0; 1 + j <= n && i - j > 0; j ++) {
            if (getElemColor(1 + j, i - j) == c) s += 1;
            else s += "0";
        }
        if (gameOver(s)) {
            return true;
        }
    }
    for (let i = 1; i <= n; i ++) {
        let s = "";
        for (let j = 0; i + j <= n && n - j > 0; j ++) {
            if (getElemColor(i + j, n - j) == c) s += 1;
            else s += "0";
        }
        if (gameOver(s)) {
            return true;
        }
    }
    return false;
};

let main = () => {
    getGrid();
    
    // 对文件添加事件监听，如果触发点击事件，就执行函数
    let stop = 0;
    let fun = function(e){
        if (stop == 0 && humanChess(e)) {
            if (ok(human)) {
                alert("人类胜利！日清写的算法完蛋！");
                document.removeEventListener("click", fun);
                stop = 1;
            }
            if (stop == 1) return;
            robotChess();
            if (ok(robot)) {
                alert("日清：兄弟，你输了，什么情况兄弟！");
                document.removeEventListener("click", fun);
                stop = 1;
            }
        }
    };
    document.addEventListener("click", fun);
};

let debug = () => {
    // 对文件添加事件监听，如果触发点击事件，就执行函数
    document.addEventListener("click", function(e){

    });
};

export {
    main,
    debug
};