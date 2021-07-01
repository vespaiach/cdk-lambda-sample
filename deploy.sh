#!/bin/sh

if [ $# -eq 0 ]
then
    read -p "Enter AWS account profile:" PROFILE
else
    PROFILE=$1
fi

yarn workspace web build
[ -e ./packages/infrastructure/build ] && rm -rf ./packages/infrastructure/build
cp -r ./packages/web/build ./packages/infrastructure/build

yarn workspace infrastructure bootstrap -- --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess --profile ${PROFILE}
yarn workspace infrastructure deploy -- --require-approval never --profile ${PROFILE}

exit 0