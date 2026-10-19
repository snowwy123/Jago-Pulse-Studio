"""Prepare the pinned optional Windows CPU transcription pack. No tools are executed."""
from pathlib import Path
import argparse,hashlib,json,shutil,urllib.request,zipfile
p=argparse.ArgumentParser();p.add_argument('--cache',required=True);p.add_argument('--output',required=True);p.add_argument('--download',action='store_true');a=p.parse_args();here=Path(__file__).resolve().parent;m=json.loads((here/'manifest.json').read_text());cache=Path(a.cache);out=Path(a.output);assert not out.exists(),'Choose a fresh output folder';cache.mkdir(parents=True,exist_ok=True)
def checked(file,digest):
 assert file.is_file() and hashlib.sha256(file.read_bytes()).hexdigest()==digest,'Missing or different dependency: '+str(file)
archive=cache/'whisper-bin-x64.zip';model=cache/'ggml-tiny.en.bin'
for file,url in [(archive,m['engineArchive']),(model,m['modelUrl'])]:
 if not file.exists() and a.download:urllib.request.urlretrieve(url,file)
checked(archive,m['engineArchiveSha256']);checked(model,m['files'][model.name]);out.mkdir(parents=True)
with zipfile.ZipFile(archive) as z:
 for name,digest in m['files'].items():
  if name.endswith(('.exe','.dll')) and name not in m.get('runtime',{}).get('files',{}):
   entry=next(n for n in z.namelist() if n.endswith('/'+name));(out/name).write_bytes(z.read(entry))
shutil.copy2(model,out/model.name)
for name in m.get('runtime',{}).get('files',{}):
 checked(cache/name,m['files'][name]);shutil.copy2(cache/name,out/name)
for name in ['whisper.cpp-LICENSE.txt','Whisper-model-LICENSE.txt','Read me.md','Microsoft-runtime-REDIST.txt','Microsoft-runtime-notice.txt']:shutil.copy2(here/name,out/name)
for name,digest in m['files'].items():checked(out/name,digest)
print('Verified optional pack: '+str(out))
