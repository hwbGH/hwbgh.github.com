var UpdateMgr=(function(){
        function UpdateMgr(){
            this.completeH=null;
            this.progressH=null;
            this.mAstDic=new Object();
        }
        var __proto=UpdateMgr.prototype;
        __proto.LoadFile=function(_fname,_complete,_progress){
            this.completeH=_complete;
            this.progressH=_progress;
            Laya.loader.load(_fname,new Laya.Handler(this,this.onComplete),new Laya.Handler(this,this.getProgress),"arraybuffer");
            return;
        }

        __proto.onComplete=function(_rdata){
            var _byte=new Laya.Byte(_rdata);
            var t_strFileHeader=_byte.readUTFBytes(4);

            if (t_strFileHeader !="fst"){
                return;
            };
            var t_dwVersion=_byte.getUint32();
            if (t_dwVersion !=100){
                return;
            }
            t_dwVersion=_byte.getUint32();

            var t_dwHash=0;
            var t_dwTime=0;
            for (var t_i=0;t_i < t_dwVersion;t_i++){
                t_dwHash=_byte.getUint32();
                t_dwTime=_byte.getUint32();
                this.mAstDic[t_dwHash]=t_dwTime;
            }
            Laya.URL.customFormat=UpdateMgr.customUrl;
            if (this.completeH){
                (this.completeH).run();
                (this.completeH).clear();
            }
        }

        __proto.getProgress=function(v){
            if (this.progressH)
                this.progressH.runWith(v);
        }

        __proto.getFileModtime=function(_str){
            var t_str=_str.toLowerCase();
            var tHash=this.string_hash(t_str);
            return this.mAstDic[tHash];
        }

        __proto.string_hash=function(_str){
            var t_dw=0;
            var t_iChar=0;
            for (var t_i=0;t_i < _str.length;t_i++){
                t_iChar=_str.charCodeAt(t_i);
                t_dw=((t_dw<<5)-t_dw)+t_iChar;
            }
            t_dw=t_dw >>> 0;
            return t_dw;
        }

        UpdateMgr.Instance=function(){
            if (UpdateMgr.m_ins==null){
                UpdateMgr.m_ins=new UpdateMgr();
                return UpdateMgr.m_ins;
            }
            return UpdateMgr.m_ins;
        }

        UpdateMgr.customUrl=function(_url,_bpath){
            if (!_url)return _url;
            var t_res=UpdateMgr.m_ins.getFileModtime(_url);
            if (t_res){
                _url=_url+"?"+t_res;
            }
            return _url;
        }

        UpdateMgr.m_ins=null;
        return UpdateMgr;
    })()