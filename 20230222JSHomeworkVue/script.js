const app = new Vue({
    el: '#container',
    data: {
        mainKey: 'todoListVue',
        newlyContent: '',
        dataInLS: [],
        isOnlyShowUnfinished: false,
        statement: '顯示所有的待辦事項'
    },
    methods: {
        setToLS(){
            localStorage.setItem(this.mainKey, JSON.stringify(this.dataInLS));
        },
        getFromLS(){
            let thingInLS = JSON.parse(localStorage.getItem(this.mainKey));
            this.dataInLS = thingInLS == null ? [] : thingInLS;
        },
        addItem(){
            this.dataInLS.push({
                id: Date.now().toString(),
                isDone: false,
                data: this.newlyContent
            });
            this.newlyContent = '';
        },
        removeItem(index){
            this.dataInLS.splice(index, 1);
        },
        toggleShowMode(){
            this.isOnlyShowUnfinished = !this.isOnlyShowUnfinished;
            
            const idx = this.isOnlyShowUnfinished ? 1 : 0;
            this.statement = ['顯示所有的待辦事項', '只顯示未完成的事項'][idx];
        }
    },
    watch: {
        dataInLS: {
            immediate: false,
            deep: true,
            handler(){ 
                this.setToLS(); 
            }
        }
    },
    computed: {
        colour(){
            return this.isOnlyShowUnfinished ? 'show-all' : 'only-unfinished';
        }
    },
    mounted: function(){
        this.getFromLS();
    }
})