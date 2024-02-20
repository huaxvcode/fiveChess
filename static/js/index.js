let n = 15;
let robot = 'rgb(34, 33, 33)';
let human = 'rgb(194, 191, 191)';
let used = new Set();

let hasUsed = (x, y) => {
    return used.has(x + " " + y);
};

let addUsed = (x, y) => {
    return used.add(x + " " + y);
};

let getColumn = function (x, y) {
    let s = `<div class="column r${x} c${y}"><div class="cell r${x} c${y}"></div></div>`;
    return s;
};

let getRow = function (x) {
    let s = `<div class="row r${x}">`;
    for (let i = 1; i <= n; i++) {
        s += getColumn(x, i);
    }
    s += "</div>";
    return s;
};

let getGrid = () => {
    let grid = document.querySelector(".grid");
    for (let i = 1; i <= n; i++) {
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

let logout = false;

let getFourPosition = (x, y) => {
    let ans = [];
    let p;
    let tmp = [];
    for (let i = 1; i <= n; i ++) {
        if (i == y) p = tmp.length;
        tmp.push(getElemColor(x, i));
    }
    ans.push(p);
    ans.push(tmp);
    tmp = [];
    for (let i = 1; i <= n; i ++) {
        if (i == x) p = tmp.length;
        tmp.push(getElemColor(i, y));
    }
    ans.push(p);
    ans.push(tmp);
    tmp = [];
    for (let i = -n; i <= n; i ++) {
        if (x + i >= 1 && x + i <= n && y + i >= 1 && y + i <= n) {
            if (x + i == x && y + i == y) p = tmp.length; 
            tmp.push(getElemColor(x + i, y + i));
        }
    }
    ans.push(p);
    ans.push(tmp);
    tmp = [];
    for (let i = -n; i <= n; i ++) {
        if (x + i >= 1 && x + i <= n && y - i >= 1 && y - i <= n) {
            if (x + i == x && y - i == y) p = tmp.length;
            tmp.push(getElemColor(x + i, y - i));
        }
    }
    ans.push(p);
    ans.push(tmp);
    return ans;
};

let reverse = (s) => {
    let ts = "";
    for (let i = s.length - 1; i >= 0; i --) {
        ts += s[i];
    }
    return ts;
}

let getInfo = (p, a, c, set) => {
    let ans = "" + set;
    for (let i = p - 1; i >= 0; i --) {
        if (a[i] == "" || a[i] == c) {
            ans += a[i] == "" ? 0 : 1;
        }
        else break;
    }
    ans = reverse(ans);
    for (let i = p + 1; i < a.length; i ++) {
        if (a[i] == "" || a[i] == c) {
            ans += a[i] == "" ? 0 : 1;
        }
        else break;
    }
    return ans;
};


let win = [
    "11112",
    "21111",
    "12111",
    "11211",
    "11121",
    "011120",
    "021110",
    "012110",
    "011210"
]

let humanWin = () => {
    for (let i = 1; i <= n; i ++) {
        for (let j = 1; j <= n; j ++) {
            if (hasUsed(i, j)) continue;
            let res = getFourPosition(i, j);
            for (let k = 0; k < res.length; k += 2) {
                let s = getInfo(res[k], res[k + 1], human, "2");
                let as = win;
                for (let l = 0; l < as.length; l ++) {
                    // console.log(s, s.includes(as[l]), "(", i, ",", j, ")");
                    if (s.includes(as[l])) {
                        // console.log(i, j);
                        return [i, j];
                    }
                }
            }
        }
    }
    return null;
}

let robotWin = () => {
    for (let i = 1; i <= n; i ++) {
        for (let j = 1; j <= n; j ++) {
            if (hasUsed(i, j)) continue;
            let res = getFourPosition(i, j);
            for (let k = 0; k < res.length; k += 2) {
                let s = getInfo(res[k], res[k + 1], robot, "2");
                let as = win;
                for (let l = 0; l < as.length; l ++) {
                    if (s.includes(as[l])) {
                        // console.log(i, j);
                        return [i, j];
                    }
                }
            }
        }
    }
    return null;
};


let nextRobotMustWin = () => {
    for (let i = 1; i <= n; i ++) {
        for (let j = 1; j <= n; j ++) {
            if (hasUsed(i, j)) continue;
            let res = getFourPosition(i, j);
            for (let k = 0; k < res.length; k += 2) {
                let s = getInfo(res[k], res[k + 1], robot, "2");
                let as = [
                    "11112",
                    "21111",
                    "12111",
                    "11211",
                    "11121",
                ];
                for (let l = 0; l < as.length; l ++) {
                    if (s.includes(as[l])) {
                        // console.log(i, j);
                        return [i, j];
                    }
                }
            }
        }
    }
    return null;
}

let inf = 1 << 20;
let dp = {
    "11112": 0,
    "21111": 0,
    "12111": 0,
    "11211": 0,
    "11121": 0,
    "011120": 0,
    "021110": 0,
    "012110": 0,
    "011210": 0,
};
// 动态规划，求出当前形状距离必胜状态的距离
let dfs = (s) => {
    if (s.length < 5) return inf;
    if (dp[s] != undefined) return dp[s];
    for (let i = 0; i < win.length; i ++) {
        if (s.includes(win[i])) {
            dp[s] = 0;
            return 0;
        }
    }
    let ts = "";
    dp[s] = inf;
    for (let i = 0; i < s.length; i ++) {
        if (s[i] == '0') {
            ts = s.substring(0, i);
            ts += '1';
            ts += s.substring(i + 1, s.length);
            dp[s] = Math.min(dp[s], dfs(ts) + 1);
        }
    }
    return dp[s];
};

let pointScore = (x, y, c) => {
    let res = getFourPosition(x, y);
    let ans = [];
    for (let i = 0; i < res.length; i += 2) {
        let s = getInfo(res[i], res[i + 1], c, "2");
        ans.push(dfs(s));
    }
    ans.sort((x, y) => {
        return x - y;
    });
    return ans;
};

let compareTo = (x, y) => {
    for (let i = 0; i < x.length; i ++) {
        if (x[i] < y[i]) return -1;
        else if (x[i] > y[i]) return 1;
    }
    return 0;
};

let cntColor = (x, y, c) => {
    let cnt = 0;
    let len = 1;
    for (let i = x - len; i <= x + len; i ++) {
        for (let j = y - len; j <= y + len; j ++) {
            if (i >= 1 && i <= n && j >= 1 && j <= n) {
                if (getElemColor(i, j) == c) cnt ++;
            }
        }
    }
    return cnt;
};

let nextPosition = () => {
    let ans = null;
    ans = nextRobotMustWin();
    if (ans != null) return ans;
    ans = humanWin();
    if (ans != null) return ans;
    ans = robotWin();
    if (ans != null) return ans;

    let sc = [ inf, inf, inf, inf ];
    let cnt = 0;

    for (let i = 1; i <= n; i ++) {
        for (let j = 1; j <= n; j ++) {
            if (hasUsed(i, j)) continue;
            
            let x = pointScore(i, j, human);
            let y = pointScore(i, j, robot);
            let t = x;
            if (compareTo(y, x) <= 0) {
                t = y;
            }

            if (ans == null) {
                ans = [i, j];
                sc = t;
                cnt = cntColor(i, j, robot);
            }

            let cmp = compareTo(sc, t);
            // if (logout) 
            // console.log(i, j, ":", ...sc, ":", ...t, ":", cmp, cnt, cntColor(i, j, robot));
            if (cmp < 0) {
                continue;
            }
            else if (cmp > 0) {
                sc = t;
                ans = [i, j];
                cnt = cntColor(i, j, robot);
            }
            else if (cmp == 0) {
                if (cnt < cntColor(i, j, robot)) {
                    sc = t;
                    ans = [i, j];
                    cnt = cntColor(i, j, robot);
                }
            }
        }
    }
    // if (logout) 
    // console.log(ans, ...sc);
    return ans;
}

let isGameOver = () => {
    for (let i = 1; i <= n; i ++) {
        for (let j = 1; j <= n; j ++) {
            let res = getFourPosition(i, j);
            for (let k = 1; k < res.length; k += 2) {
                let s = "";
                for (let l = 0; l < res[k].length; l ++) {
                    if (res[k][l] == "") s += "0";
                    else if (res[k][l] == human) s += "1";
                    else if (res[k][l] == robot) s += "2";
                }
                if (s.includes("11111")) return -1;
                else if (s.includes("22222")) return 1;
            }
        }
    }
    return 0;
};

let main = () => {
    getGrid();
    let x = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < 1000; i ++) {
        Math.random();
    }
    let y = Math.floor(Math.random() * 2) + 1;
    if (Math.random() < 0.5) x *= -1;
    for (let i = 0; i < 1000; i ++) {
        Math.random();
    }
    if (Math.random() < 0.5) y *= -1;
    let t = Math.floor(n / 2) + 1;
    setElemColor(t + x, t + y, robot);
    addUsed(t + x, t + y);

    // console.log(dfs("0000020000"));
    // return;

    // 对文件添加事件监听，如果触发点击事件，就执行函数
    let stop = false;
    let fun = function (e) {
        if (!stop && humanChess(e)) {
            let status = isGameOver();
            if (status == -1) {
                alert("日清：好样的！兄弟，你赢了！");
                document.removeEventListener("click", fun);
                stop = true;
                return;
            }
            else if (status == 1) {
                alert("日清：什么情况！兄弟，你输了！");
                document.removeEventListener("click", fun);
                stop = true;
                return;
            }
            let p = nextPosition();
            if (p == null) {
                alert("日清：兄弟，好像死局了，我不知道往哪下！");
                document.removeEventListener("click", fun);
                stop = true;
                return;
            }
            setElemColor(p[0], p[1], robot);
            addUsed(p[0], p[1]);
            status = isGameOver();
            if (status == -1) {
                alert("日清：好样的！兄弟，你赢了！");
                document.removeEventListener("click", fun);
                stop = true;
                return;
            }
            else if (status == 1) {
                alert("日清：什么情况！兄弟，你输了！");
                document.removeEventListener("click", fun);
                stop = true;
                return;
            }
        }
    };
    document.addEventListener("click", fun);
};

let debug = () => {
    // 对文件添加事件监听，如果触发点击事件，就执行函数
    document.addEventListener("click", function (e) {
    });
};

export {
    main,
    debug
};