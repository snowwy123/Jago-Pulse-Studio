"""Verify actual bundled-engine auto detection with a local mono 16kHz WAV."""
from pathlib import Path
import argparse,json,subprocess
p=argparse.ArgumentParser();p.add_argument('--app',required=True);p.add_argument('--audio',required=True);p.add_argument('--output',required=True);p.add_argument('--missing',action='store_true');a=p.parse_args();app=Path(a.app).resolve();out=Path(a.output).resolve();assert not out.exists(),'Choose a fresh test directory';out.mkdir(parents=True);(out/'speech-check.json').write_text(json.dumps({'audio':str(Path(a.audio).resolve())}));si=subprocess.STARTUPINFO();si.dwFlags|=subprocess.STARTF_USESHOWWINDOW;si.wShowWindow=0
subprocess.run([str(app),'--speech-check',str(out)],startupinfo=si,timeout=120,check=True);data=json.loads((out/'native-speech.json').read_text(encoding='utf-8-sig'));assert data['ok']==(not a.missing),data
if not a.missing:assert Path(data['executable']).parent==app.parent/'Transcription' and '-->' in data['srt'] and data['srt'].strip(),data
print(json.dumps(data,indent=2))
