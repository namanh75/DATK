if(scheduleDetailElemnt[i].style.display=='none'){
        Object.assign(scheduleDetailElemnt[i].style, {
            display: 'block',
        })
        e.target.innerHTML='Less'
    }
    else{
        Object.assign(scheduleDetailElemnt[i].style, {
            display: 'none',
        })
        e.target.innerHTML='Detail'
    } 