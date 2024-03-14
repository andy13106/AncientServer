
//组件类型，根据游戏类型组件类型也不一样
exports.ComponentType={
    ECT_NONE:0,
    ECT_GAMEMGR:1,      //游戏管理器
    ECT_ITEMMGR:1,      //物品管理器
    ECT_QUESTMGR:2,     //任务管理器
    ECT_STORAGE:3,      //存储信息
}


exports.GAMEMGRTYPE={
    GAME_MANAGER_COMPONENT:ComponentType.ECT_GAMEMGR << 8,
}

exports.ITEMMGRTYPE={
    ITEM_MANAGER_COMPONENT:ComponentType.ECT_ITEMMGR << 8,
}

exports.QUESTMGRTYPE={
    QUEST_MANAGER_COMPONENT:ComponentType.ECT_QUESTMGR << 8,
}

exports.STORAGETYPE={
    STORAGE_COMPONENT:ComponentType.ECT_STORAGE << 8,
}