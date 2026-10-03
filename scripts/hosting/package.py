"""Create a Linux-friendly, verified ZIP with only public deployment files."""
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED
import hashlib
import stat

root = Path(__file__).resolve().parents[2]
source = root / 'out'
destination = root / 'outputs' / 'hosting'
destination.mkdir(parents=True, exist_ok=True)
archive = destination / 'imanakov.dev-hosting.zip'
assert (source / 'index.html').is_file(), 'Run npm run build:hosting first'
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    for item in sorted(source.rglob('*')):
        name = item.relative_to(source).as_posix()
        info = ZipInfo(name + '/' if item.is_dir() else name)
        info.create_system = 3
        info.external_attr = ((stat.S_IFDIR | 0o755) if item.is_dir() else (stat.S_IFREG | 0o644)) << 16
        info.compress_type = ZIP_DEFLATED
        bundle.writestr(info, b'' if item.is_dir() else item.read_bytes())
with ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert '.htaccess' in bundle.namelist()
    assert all('\\' not in name for name in bundle.namelist())
digest = hashlib.sha256(archive.read_bytes()).hexdigest()
(destination / 'SHA256.txt').write_text(f'{digest}  {archive.name}\n', encoding='utf-8')
(destination / 'READ-ME.md').write_text((root / 'docs' / 'HOSTING.md').read_text(encoding='utf-8'), encoding='utf-8')
(destination / 'nginx-location.conf').write_bytes((root / 'scripts' / 'hosting' / 'nginx-location.conf').read_bytes())
print(f'{archive}\n{archive.stat().st_size:,} bytes; integrity OK; SHA256 {digest}')
