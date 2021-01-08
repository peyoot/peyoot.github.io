git clone $PUBLIC_HEXO_GITHUB_URL
dir_git=${PUBLIC_HEXO_GITHUB_URL##*/}
cd ${dir_git%.*}
npm install
npm install hexo-deployer-git --save 
git config --global user.name "peyoot"
git config --global user.email "peyoot@hotmail.com"
hexo generate
hexo server
